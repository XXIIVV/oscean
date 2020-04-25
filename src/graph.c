// You cannot be that which you observe

void fputs_graph_daily(FILE *f, Journal *journal) {
  char *colors[] = {"#fff", "#eee", "#ddd", "#bbb", "#999",
                    "#666", "#444", "#222", "#111", "#000"};

  int moment[365];
  select_moment(journal, moment, 0, 364);

  // Draw
  int w = 16;
  int h = 8;
  fprintf(f, "<figure>");
  fprintf(f, "<svg width='%d' height='%d' xmlns='http://www.w3.org/2000/svg'>",
          w * 52, h * 7);

  for (int doty = 0; doty < 365; ++doty) {
    int x = (doty / 7) * w;
    int y = (doty % 7) * h;
    int value = moment[364 - doty];
    char *color = colors[value];
    fprintf(f, "<rect x='%d' y='%d' width='%d' height='%d' fill='black'/>", x,
            y, w, clamp_int(round(h * value / 10), 1, h));
  }

  fprintf(f, "</svg>");
  fprintf(
      f, "<figcaption>Fig. Daily Activity for the past 365 days.</figcaption>");
  fprintf(f, "</figure>");
}

//

void fputs_graph_burn(FILE *f, Journal *journal) {
  int segs[52];

  // The Arvelie calendar has 26 months of 14 days each.
  // Blank out array
  for (int i = 0; i < 52; ++i) {
    segs[i] = 0;
  }

  // Populate last logs with offset
  for (int i = 0; i < 52 * 14; ++i) {
    Log l = journal->logs[i];
    int offset = offset_from_arvelie(l.date);
    if (offset < 0) {
      continue;
    }
    int seg = (offset / 14);
    if (seg >= 52) {
      continue;
    }
    segs[seg] += l.code % 10;
  }

  float average = find_average(segs);

  // Calculate Offset
  float offsets[52];
  for (int i = 0; i < 52; ++i) {
    offsets[i] = (segs[51 - i] - average) * -2;
  }

  // Bleed
  float bleed[52];
  float prev = offsets[0];
  float prev2 = offsets[0];
  for (int i = 0; i < 52; ++i) {
    prev2 = prev;
    bleed[i] = (offsets[i] + prev + prev2) / 3;
    prev = bleed[i];
  }

  // Draw
  int s = 11;
  int w = (s + 1) * 52;

  fprintf(f, "<figure>");
  fprintf(f, "<svg width='%d' height='%d' xmlns='http://www.w3.org/2000/svg' class='burn' style='border: 1.5px solid;'>", w, (s+1) * 7);

  // Middle
  fprintf(f, "<line x1='0' y1='42' x2='700' y2='42' style='fill:none;stroke:black;stroke-width:1;stroke-linejoin:round;stroke-dasharray:0,2; stroke-linecap:round'/>");

  // Phase
  int phase = 0;
  float last_phase_pos = 0;
  
  // Path
  last_phase_pos = 0;
  fprintf(f, "<path d='M0,42 ");
  for (int i = 0; i < 52; ++i) {
    if(i == 0){ continue; }
    if(bleed[i-1] > 0 && bleed[i] > 0){ continue; }
    if(bleed[i-1] < 0 && bleed[i] < 0){ continue; }
    if(bleed[i-1] < 0 && bleed[i] > 0){ phase = 1; }
    if(bleed[i-1] > 0 && bleed[i] < 0){ phase = -1; }
    // phase shift
    float x = i * (s+1);
    fprintf(f, "L%f,%d ", last_phase_pos, (-20 * phase) + 42); 
    fprintf(f, "L%f,%d ", x, (-20 * phase) + 42); 
    last_phase_pos = x;
  }
  fprintf(f, "L%f,%d ", last_phase_pos, (-20 * -phase) + 42); 
  fprintf(f, "L%d,%d ", w, (-20 * -phase) + 42); 
  fprintf(f, "' style='fill:none;stroke:#ddd;stroke-width:1;stroke-linejoin:round'/>");

  // Polyline bleed
  fprintf(f, "<polyline points='");
  fprintf(f, "%d,%f ", 0, clamp(bleed[0], -36, 36) + 42); // lead
  for (int i = 0; i < 52; ++i) {
    float x = i * (s+1) + (s/2);
    float y = clamp(bleed[i], -36, 36) + 42;
    fprintf(f, "%f,%f ", x, y);    
  }
  fprintf(f, "%d,%f ", w, clamp(bleed[51], -36, 36) + 42); // lead
  fprintf(f, "' style='fill:none;stroke:black;stroke-width:1;stroke-linejoin:round'/>");

  for (int i = 0; i < 52; ++i) {
    if(i == 0){ continue; }
    if(bleed[i-1] > 0 && bleed[i] > 0){ continue; }
    if(bleed[i-1] < 0 && bleed[i] < 0){ continue; }
    if(bleed[i-1] < 0 && bleed[i] > 0){ phase = 1; }
    if(bleed[i-1] > 0 && bleed[i] < 0){ phase = -1; }
    // phase shift
    float x = i * (s+1);
    if(phase == 1){
      fprintf(f, "<line x1='%f' y1='42' x2='%f' y2='100' style='fill:none;stroke:#42ae92;stroke-width:1;stroke-linejoin:round'/>", x, x);    
    }
    else if(phase == -1){
      fprintf(f, "<line x1='%f' y1='0' x2='%f' y2='42' style='fill:none;stroke:red;stroke-width:1;stroke-linejoin:round'/>", x, x);  
    }
    last_phase_pos = x;
  }

  for (int i = 0; i < 52; ++i) {
    if(i == 0){ continue; }
    if(bleed[i-1] > 0 && bleed[i] > 0){ continue; }
    if(bleed[i-1] < 0 && bleed[i] < 0){ continue; }
    if(bleed[i-1] < 0 && bleed[i] > 0){ phase = 1; }
    if(bleed[i-1] > 0 && bleed[i] < 0){ phase = -1; }
    // phase shift
    float x = i * (s+1);
    if(phase == 1){
      fprintf(f, "<circle cx='%f' cy='42' r='2' style='fill:#55a69a;stroke:0'/>", x);  
    }
    else if(phase == -1){
      fprintf(f, "<circle cx='%f' cy='42' r='2' style='fill:red;stroke:0'/>", x);  
    }
    last_phase_pos = x;
  }

  fprintf(f, "</svg>");
  fprintf(f, "<figcaption>Fig. Cycles of burn and rest of previous %d days.</figcaption>", 52 * 14);
  fprintf(f, "</figure>");
}