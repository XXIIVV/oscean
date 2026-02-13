(* uxnmin.ml -- Javier B. Torres <lobo@quiltro.org>
   This file is under the public domain. 

   ocamlopt uxnmin.ml -o uxnmin *)

(* Wrapping read/write utilities *)
let uint8_to_int8 i = (i lsl (Sys.int_size - 8)) asr (Sys.int_size - 8)
let uint16_to_int16 i = (i lsl (Sys.int_size - 16)) asr (Sys.int_size - 16)

let get_uint16_wrap ?(wrap = 0xff) (bytes : bytes) (position : int) : int =
  let i0 = position land wrap in
  let hi = Bytes.get_uint8 bytes i0 in
  let lo = Bytes.get_uint8 bytes ((i0 + 1) land wrap) in
  (hi lsl 8) lor lo

let get_int16_wrap ?(wrap = 0xff) (bytes : bytes) (position : int) : int =
  get_uint16_wrap ~wrap bytes position |> uint16_to_int16

let set_uint16_wrap ?(wrap = 0xff) (bytes : bytes) (position : int)
    (value : int) : unit =
  let i0 = position land wrap in
  Bytes.set_uint8 bytes i0 ((value lsr 8) land 0xff);
  Bytes.set_uint8 bytes ((i0 + 1) land wrap) (value land 0xff)

(* Stack manipulation primitives *)
type stack = { data : bytes; mutable sp : int }
type mode = { short : bool; keep : bool; mutable temp : int }

let peek { short; keep; temp } { data; sp } : int =
  let amt = if short then 2 else 1 in
  let sp = if keep then (temp - amt) land 0xff else (sp - amt) land 0xff in
  if short then get_uint16_wrap data sp else Bytes.get_uint8 data sp
[@@inline]

let pop m s =
  let res = peek m s in
  let amt = if m.short then 2 else 1 in
  if m.keep then m.temp <- (m.temp - amt) land 0xff
  else s.sp <- (s.sp - amt) land 0xff;
  res
[@@inline]

let push ({ short; keep; _ } as m) (s : stack) (v : int) =
  if short then set_uint16_wrap s.data s.sp (v land 0xffff)
  else Bytes.set_uint8 s.data s.sp (v land 0xff);
  let amt = if m.short then 2 else 1 in
  if keep then m.temp <- (m.temp + amt) land 0xff;
  s.sp <- (s.sp + amt) land 0xff
[@@inline]

let pushbyte m s v =
  let m' = { m with short = false } in
  push m' s v;
  let { temp; _ } = m' in
  m.temp <- temp
[@@inline]

let popbyte m s =
  let m' = { m with short = false } in
  let r = pop m' s in
  let { temp; _ } = m' in
  m.temp <- temp;
  r
[@@inline]

let popshort m s =
  let m' = { m with short = true } in
  let r = pop m' s in
  let { temp; _ } = m' in
  m.temp <- temp;
  r
[@@inline]

let pop1 s = pop { short = false; keep = false; temp = 0 } s [@@inline]
let push1 s v = push { short = false; keep = false; temp = 0 } s v [@@inline]
let push2 s v = push { short = true; keep = false; temp = 0 } s v [@@inline]

(* Machine state *)
let ram = Bytes.create 65536
let dev = Bytes.create 256
let wst = { data = Bytes.create 256; sp = 0 }
let rst = { data = Bytes.create 256; sp = 0 }
let console_vector = ref 0

(* Devices *)
let dei port = Bytes.get_uint8 dev port

let deo port =
  match port with
  | 0x10 | 0x11 -> console_vector := get_uint16_wrap dev 0x10
  | 0x18 ->
      print_char (Bytes.get dev 0x18);
      Out_channel.flush stdout
  | 0x19 ->
      prerr_char (Bytes.get dev 0x19);
      Out_channel.flush stderr
  | _ -> ()

(* Dispatch loop *)
let dispatch (pc : int) =
  let pc = ref pc in

  try
    while true do
      let op = Bytes.get_uint8 ram (!pc land 0xffff) in
      pc := (!pc + 1) land 0xffff;

      let short = op land 0x20 <> 0 in
      let keep = op land 0x80 <> 0 in
      let return = op land 0x40 <> 0 in
      let opcode = op land 0x1f in

      match op with
      | 0x00 -> raise Exit
      | 0x20 (* JCI *) ->
          let cond = pop1 wst in
          let addr = get_int16_wrap ~wrap:0xffff ram !pc in
          if cond != 0 then pc := !pc + addr + 2 else pc := !pc + 2
      | 0x40 (* JMI *) ->
          let addr = get_int16_wrap ~wrap:0xffff ram !pc in
          pc := !pc + addr + 2
      | 0x60 (* JSI *) ->
          let addr = get_int16_wrap ~wrap:0xffff ram !pc in
          push2 rst (!pc + 2);
          pc := !pc + addr + 2
      | 0x80 (* LIT *) ->
          let lit = Bytes.get_uint8 ram !pc in
          push1 wst lit;
          pc := !pc + 1
      | 0xa0 (* LIT2 *) ->
          let lit = get_uint16_wrap ~wrap:0xffff ram !pc in
          push2 wst lit;
          pc := !pc + 2
      | 0xc0 (* LITr *) ->
          let lit = Bytes.get_uint8 ram !pc in
          push1 rst lit;
          pc := !pc + 1
      | 0xe0 (* LIT2r *) ->
          let lit = get_uint16_wrap ~wrap:0xffff ram !pc in
          push2 rst lit;
          pc := !pc + 2
      | _ -> begin
          let stk = if return then rst else wst in
          let stk' = if return then wst else rst in
          let mode = { short; keep; temp = stk.sp } in
          match[@warning "-8"] opcode with
          | 0x01 (* INC *) ->
              let r = pop mode stk in
              push mode stk (r + 1)
          | 0x02 (* POP *) -> ignore (pop mode stk)
          | 0x03 (* NIP *) ->
              let b = pop mode stk in
              ignore (pop mode stk);
              push mode stk b
          | 0x04 (* SWP *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk b;
              push mode stk a
          | 0x05 (* ROT *) ->
              let c = pop mode stk in
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk b;
              push mode stk c;
              push mode stk a
          | 0x06 (* DUP *) ->
              let a = pop mode stk in
              push mode stk a;
              push mode stk a
          | 0x07 (* OVR *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk a;
              push mode stk b;
              push mode stk a
          | 0x08 (* EQU *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              pushbyte mode stk (if a = b then 1 else 0)
          | 0x09 (* NEQ *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              pushbyte mode stk (if a != b then 1 else 0)
          | 0x0a (* GTH *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              pushbyte mode stk (if a > b then 1 else 0)
          | 0x0b (* LTH *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              pushbyte mode stk (if a < b then 1 else 0)
          | 0x0c (* JMP *) ->
              let addr = pop mode stk in
              if short then pc := addr else pc := !pc + uint8_to_int8 addr
          | 0x0d (* JCN *) ->
              let addr = pop mode stk in
              let cond = popbyte mode stk in
              if cond != 0 then
                if short then pc := addr else pc := !pc + uint8_to_int8 addr
          | 0x0e (* JSR *) ->
              push2 rst !pc;
              let addr = pop mode stk in
              if short then pc := addr else pc := !pc + uint8_to_int8 addr
          | 0x0f (* STH *) ->
              let a = pop mode stk in
              push mode stk' a
          | 0x10 (* LDZ *) ->
              let addr = popbyte mode stk in
              push mode stk
                (if short then get_uint16_wrap ram addr
                 else Bytes.get_uint8 ram addr)
          | 0x11 (* STZ *) ->
              let addr = popbyte mode stk in
              let v = pop mode stk in
              if short then set_uint16_wrap ram addr v
              else Bytes.set_uint8 ram addr v
          | 0x12 (* LDR *) ->
              let addr = !pc + uint8_to_int8 (popbyte mode stk) in
              push mode stk
                (if short then get_uint16_wrap ~wrap:0xffff ram addr
                 else Bytes.get_uint8 ram addr)
          | 0x13 (* STR *) ->
              let addr = !pc + uint8_to_int8 (popbyte mode stk) in
              let v = pop mode stk in
              if short then set_uint16_wrap ~wrap:0xffff ram addr v
              else Bytes.set_uint8 ram addr v
          | 0x14 (* LDA *) ->
              let addr = popshort mode stk in
              push mode stk
                (if short then get_uint16_wrap ~wrap:0xffff ram addr
                 else Bytes.get_uint8 ram addr)
          | 0x15 (* STA *) ->
              let addr = popshort mode stk in
              let v = pop mode stk in
              if short then set_uint16_wrap ~wrap:0xffff ram addr v
              else Bytes.set_uint8 ram addr v
          | 0x16 (* DEI *) ->
              let port = popbyte mode stk in
              push mode stk (dei port)
          | 0x17 (* DEO *) ->
              let port = popbyte mode stk in
              let value = pop mode stk in
              if short then set_uint16_wrap dev port value
              else Bytes.set_uint8 dev port value;
              deo port
          | 0x18 (* ADD *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk (a + b)
          | 0x19 (* SUB *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk (a - b)
          | 0x1a (* MUL *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk (a * b)
          | 0x1b (* DIV *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk (if b = 0 then 0 else a / b)
          | 0x1c (* AND *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk (a land b)
          | 0x1d (* ORA *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk (a lor b)
          | 0x1e (* EOR *) ->
              let b = pop mode stk in
              let a = pop mode stk in
              push mode stk (a lxor b)
          | 0x1f (* SFT *) ->
              let sft = popbyte mode stk in
              let value = pop mode stk in
              push mode stk ((value lsr (sft land 0xf)) lsl sft lsr 4)
        end
    done
  with Exit -> ()

let main () =
  (* Initialize machine *)
  Bytes.unsafe_fill ram 0 65536 '\x00';
  Bytes.unsafe_fill dev 0 256 '\x00';
  Bytes.unsafe_fill wst.data 0 256 '\x00';
  Bytes.unsafe_fill rst.data 0 256 '\x00';

  if Array.length Sys.argv < 2 then (
    Printf.eprintf "usage: uxnmin file.rom ...\n";
    exit 1);
  let code =
    In_channel.with_open_bin Sys.argv.(1) (fun i -> In_channel.input_all i)
  in
  Bytes.blit_string code 0 ram 0x100 (String.length code);

  In_channel.set_binary_mode stdin true;
  Out_channel.set_binary_mode stdout true;

  let has_args = Array.length Sys.argv > 2 in
  Bytes.set_uint8 dev 0x17 (if has_args then 1 else 0);

  dispatch 0x100;

  if !console_vector <> 0 then begin
    let console_input ch ty =
      Bytes.set_uint8 dev 0x12 ch;
      Bytes.set_uint8 dev 0x17 ty;
      if Bytes.get_uint8 dev 0x0f = 0 then dispatch !console_vector
    in
    if has_args then begin
      for i = 2 to Array.length Sys.argv - 1 do
        let arg = Sys.argv.(i) in
        String.iter
          (fun c ->
            if Bytes.get_uint8 dev 0x0f = 0 then console_input (Char.code c) 2)
          arg;
        if Bytes.get_uint8 dev 0x0f = 0 then
          console_input 0 (if i = Array.length Sys.argv - 1 then 4 else 3)
      done
    end;
    try
      while Bytes.get_uint8 dev 0x0f = 0 do
        match In_channel.input_byte stdin with
        | None -> raise Exit
        | Some c -> console_input c 1
      done
    with Exit -> console_input 0 4
  end;
  exit (Bytes.get_uint8 dev 0x0f land 0x7f)

let _ = main ()