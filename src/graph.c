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

  fprintf(f, "<figure>");
  fprintf(f, "<svg width='%d' height='%d' xmlns='http://www.w3.org/2000/svg' class='daily'>", (size+1) * 52, (size+1) * 7);

  for (int doty = 0; doty < 365; ++doty) {
    int x = (doty /7) * (size+1);
    int y = (doty % 7) * (size+1);
    int sector = segs[doty]/100;
    fprintf(f, "<rect x='%d' y='%d' rx='2' ry='2' width='%d' height='%d' class='sector%d'/>", x, y, size, size, sector);
  }

  fprintf(f, "</svg>");
  fprintf(f, "<figcaption>Fig. Daily Activity for the past 365 days.</figcaption>");

  fprintf(f, "</figure>");

  // style

  fprintf(f, "<style>svg.daily { } svg.daily rect { fill:#ddd; stroke:none} svg.daily rect.sector1 { fill:#72dec2 } svg.daily rect.sector2 { fill:#51A196 } svg.daily rect.sector3 { fill:#316067 }</style>");


}