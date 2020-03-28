// You cannot be that which you observe

void fputs_graph_daily(FILE *f, Journal *journal) { 
  int segs[365];
  int size = 11;

  // Blank out array
  for (int i = 0; i < 365; ++i) {
    segs[i] = 0;
  }

  // Populate last logs with offset
  for (int i = 0; i < 365; ++i) {
    Log l = journal->logs[i];
    int offset = offset_from_arvelie(l.date);
    if(offset < 0){ continue; }
    if(offset > 364){ break; }
    segs[offset] = l.code;
  }

  // Draw
  fprintf(f, "<figure>");
  fprintf(f, "<svg width='%d' height='%d' xmlns='http://www.w3.org/2000/svg' class='daily'>", (size+1) * 52, (size+1) * 7);

  for (int doty = 0; doty < 365; ++doty) {
    int x = (doty /7) * (size+1);
    int y = (doty % 7) * (size+1);
    int sector = segs[364-doty]/100;
    fprintf(f, "<rect x='%d' y='%d' rx='2' ry='2' width='%d' height='%d' class='sector%d'/>", x, y, size, size, sector);
  }

  fprintf(f, "</svg>");
  fprintf(f, "<figcaption>Fig. Daily Activity for the past 365 days.</figcaption>");
  fprintf(f, "</figure>");

  // style
  fprintf(f, "<style>svg.daily { } svg.daily rect { fill:#ddd; stroke:none} svg.daily rect.sector1 { fill:#72dec2 } svg.daily rect.sector2 { fill:#51A196 } svg.daily rect.sector3 { fill:#316067 }</style>");
}

void fputs_graph_burn(FILE *f, Journal *journal) {
  int segs[52];
  int size = 11;

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

  // Calculate Offset
  float offsets[52];
  for (int i = 0; i < 52; ++i) {
    // Find average
    int sum = 0;
    for (int j = 0; j < 52; ++j) {
      sum += segs[j];
    }
    float average = sum / 52;
    float offset = (segs[i] - average) * 1.5;  // 1.5 = accent
    offsets[i] = offset;
  }

  // Draw
  fprintf(f, "<figure>");
  fprintf(f, "<svg width='%d' height='%d' xmlns='http://www.w3.org/2000/svg' class='burn'>", (size+1) * 52, (size+1) * 7);

  for (int i = 0; i < 52; ++i) {
    float offset = offsets[i];

    if(offset > 10){
      int w = size;
      int h = offset < 2 ? 2 : offset;
      h = h > 42 ? 42 : h; // clamp
      int x = (size+1) * (52-i);
      int y = (((size+1) * 7)/2) - 2;
      fprintf(f, "<rect x='%d' y='%d' rx='2' ry='2' width='%d' height='%d' class='rest'/>", x, y, w, h);
    }
    else if(offset < -10){
      int w = size;
      int h = (offset > -2 ? -2 : offset) * -1;
      h = h > 42 ? 42 : h;
      int x = (size+1) * (52-i);
      int y = (((size+1) * 7)/2) - h + 2;
      fprintf(f, "<rect x='%d' y='%d' rx='2' ry='2' width='%d' height='%d' class='burn'/>", x, y, w, h);
    }
    else{
      int w = size;
      int h = 4;
      int x = (size+1) * (52-i);
      int y = 42-2;
      fprintf(f, "<rect x='%d' y='%d' rx='2' ry='2' width='%d' height='%d' class='well'/>", x, y, w, h);
    }

  }
  fprintf(f, "</svg>");
  fprintf(f, "<figcaption>Fig. Cycles of burn and rest.</figcaption>");
  fprintf(f, "</figure>");

  // style
  fprintf(f, "<style>svg.burn { } svg.burn rect { fill:#000; stroke:none} svg.burn rect.rest { fill:#72dec2 } svg.burn rect.well { fill:#51A196 } svg.burn rect.burn { fill:#316067 }</style>");
}