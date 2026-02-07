
import { BrokerInfo } from './types';

export const BROKER_MAP: Record<string, BrokerInfo> = {
  MS: { code: 'MS', type: 'RICH', desc: 'Morgan Stanley: Asing US.' },
  UB: { code: 'UB', type: 'RICH', desc: 'UBS: Asing kuat.' },
  BK: { code: 'BK', type: 'RICH', desc: 'JP Morgan: Arus institusi.' },
  AK: { code: 'AK', type: 'RICH', desc: 'UBS Patungan.' },
  YP: { code: 'YP', type: 'RICH', desc: 'Mirae Asset: Top Ritel Pro & Institusi.' },
  ZP: { code: 'ZP', type: 'RICH', desc: 'MNC Sekuritas: Institusi Lokal.' },
  HD: { code: 'HD', type: 'RICH', desc: 'KGI Sekuritas.' },
  RX: { code: 'RX', type: 'RICH', desc: 'RHB Sekuritas.' },
  DU: { code: 'DU', type: 'RICH', desc: 'Deutsche Sekuritas.' },
  CG: { code: 'CG', type: 'RICH', desc: 'CGS-CIMB.' },
  KZ: { code: 'KZ', type: 'RICH', desc: 'CLSA Sekuritas.' },
  DR: { code: 'DR', type: 'RICH', desc: 'Danareksa (Institusi).' },
  LH: { code: 'LH', type: 'RICH', desc: 'Lautandhana.' },
  AH: { code: 'AH', type: 'RICH', desc: 'Andalan.' },
  GW: { code: 'GW', type: 'RICH', desc: 'Golden.' },
  RB: { code: 'RB', type: 'RICH', desc: 'RHB.' },
  TP: { code: 'TP', type: 'RICH', desc: 'Trimegah (Institusi).' },
  KK: { code: 'KK', type: 'RICH', desc: 'Kresna.' },
  LS: { code: 'LS', type: 'RICH', desc: 'Laurent.' },
  HP: { code: 'HP', type: 'KONGLO', desc: 'Henan Putihrai: Spesialis grup konglomerasi.' },
  DX: { code: 'DX', type: 'KONGLO', desc: 'Bahana (Kadang Institusi/Konglo).' },
  LG: { code: 'LG', type: 'KONGLO', desc: 'Trimegah (Akun Khusus).' },
  MU: { code: 'MU', type: 'KONGLO', desc: 'Minna Padi.' },
  ES: { code: 'ES', type: 'KONGLO', desc: 'Ekosistem Grup Tertentu.' },
  MG: { code: 'MG', type: 'KONGLO', desc: 'Semesta Indovest (Sering jadi MM).' },
  XL: { code: 'XL', type: 'AMPAS', desc: 'Stockbit: Ritel crowd, panic easy.' },
  XC: { code: 'XC', type: 'AMPAS', desc: 'Ajaib: Ritel pemula & mahasiswa.' },
  PD: { code: 'PD', type: 'AMPAS', desc: 'Indo Premier: Ritel massal.' },
  CC: { code: 'CC', type: 'AMPAS', desc: 'Mandiri Sekuritas (Akun Ritel).' },
  CP: { code: 'CP', type: 'AMPAS', desc: 'Valbury (Ritel).' },
  NI: { code: 'NI', type: 'AMPAS', desc: 'BNI Sekuritas (Ritel).' },
  IF: { code: 'IF', type: 'AMPAS', desc: 'Samuel Sekuritas (Ritel).' },
  BB: { code: 'BB', type: 'AMPAS', desc: 'Verdhana (Ritel).' },
  SS: { code: 'SS', type: 'AMPAS', desc: 'Ajaib (Kode lama/baru).' },
  BQ: { code: 'BQ', type: 'AMPAS', desc: 'Korea Investment (Ritel).' },
  GR: { code: 'GR', type: 'AMPAS', desc: 'Panin (Ritel).' },
  SA: { code: 'SA', type: 'AMPAS', desc: 'Ritel Kecil.' },
  SC: { code: 'SC', type: 'AMPAS', desc: 'Ritel Kecil.' },
  SF: { code: 'SF', type: 'AMPAS', desc: 'Surya Fajar.' },
  SH: { code: 'SH', type: 'AMPAS', desc: 'Artha Sekuritas (Ritel).' },
  SQ: { code: 'SQ', type: 'AMPAS', desc: 'BCA Sekuritas (Ritel).' },
  TF: { code: 'TF', type: 'AMPAS', desc: 'Universal.' },
  TS: { code: 'TS', type: 'AMPAS', desc: 'Tri Megah (Ritel).' },
  TX: { code: 'TX', type: 'AMPAS', desc: 'Ritel.' },
  XA: { code: 'XA', type: 'AMPAS', desc: 'Ritel.' },
  YB: { code: 'YB', type: 'AMPAS', desc: 'Mega Capital (Ritel).' },
  YJ: { code: 'YJ', type: 'AMPAS', desc: 'Lotus (Ritel).' },
  YO: { code: 'YO', type: 'AMPAS', desc: 'Amantara.' },
  ZR: { code: 'ZR', type: 'AMPAS', desc: 'Bumiputera.' },
  AD: { code: 'AD', type: 'CAMPUR', desc: 'Oso Sekuritas.' },
  AF: { code: 'AF', type: 'CAMPUR', desc: 'Harita.' },
  AG: { code: 'AG', type: 'CAMPUR', desc: 'Kiwoom.' },
  AI: { code: 'AI', type: 'CAMPUR', desc: 'UOB Kay Hian.' },
  AJ: { code: 'AJ', type: 'CAMPUR', desc: 'Pillars.' },
  AN: { code: 'AN', type: 'CAMPUR', desc: 'Wanteg.' },
  AO: { code: 'AO', type: 'CAMPUR', desc: 'Erdikha.' },
  AP: { code: 'AP', type: 'CAMPUR', desc: 'Pacific.' },
  AR: { code: 'AR', type: 'CAMPUR', desc: 'Binaartha.' },
  AZ: { code: 'AZ', type: 'CAMPUR', desc: 'Sucor (Campur Ritel/Institusi).' },
  BF: { code: 'BF', type: 'CAMPUR', desc: 'Inti Fikasa.' },
  BS: { code: 'BS', type: 'CAMPUR', desc: 'Equity.' },
  BZ: { code: 'BZ', type: 'CAMPUR', desc: 'Batavia.' },
  DD: { code: 'DD', type: 'CAMPUR', desc: 'Makinta.' },
  DM: { code: 'DM', type: 'CAMPUR', desc: 'Masindo.' },
  DP: { code: 'DP', type: 'CAMPUR', desc: 'DBS Vickers.' },
  EL: { code: 'EL', type: 'CAMPUR', desc: 'Evergreen.' },
  FO: { code: 'FO', type: 'CAMPUR', desc: 'Forte.' },
  FS: { code: 'FS', type: 'CAMPUR', desc: 'Fasilitas.' },
  FZ: { code: 'FZ', type: 'CAMPUR', desc: 'Waterfront.' },
  IC: { code: 'IC', type: 'CAMPUR', desc: 'BCA (Campur).' },
  ID: { code: 'ID', type: 'CAMPUR', desc: 'Anugerah.' },
  IH: { code: 'IH', type: 'CAMPUR', desc: 'Pacific 2000.' },
  II: { code: 'II', type: 'CAMPUR', desc: 'Danatama.' },
  IN: { code: 'IN', type: 'CAMPUR', desc: 'Investindo.' },
  IT: { code: 'IT', type: 'CAMPUR', desc: 'Inti Teladan.' },
  IU: { code: 'IU', type: 'CAMPUR', desc: 'Indo Capital.' },
  JB: { code: 'JB', type: 'CAMPUR', desc: 'Jasa Utama.' },
  KI: { code: 'KI', type: 'CAMPUR', desc: 'Ciptadana.' },
  KS: { code: 'KS', type: 'CAMPUR', desc: 'Karta.' },
  MI: { code: 'MI', type: 'CAMPUR', desc: 'Victoria.' },
  MK: { code: 'MK', type: 'CAMPUR', desc: 'MNC (Campur).' },
  OD: { code: 'OD', type: 'CAMPUR', desc: 'Danareksa.' },
  OK: { code: 'OK', type: 'CAMPUR', desc: 'Nett.' },
  PC: { code: 'PC', type: 'CAMPUR', desc: 'Panca Global.' },
  PF: { code: 'PF', type: 'CAMPUR', desc: 'Danasakti.' },
  PG: { code: 'PG', type: 'CAMPUR', desc: 'Panca Global.' },
  PI: { code: 'PI', type: 'CAMPUR', desc: 'Pendanaan.' },
  PO: { code: 'PO', type: 'CAMPUR', desc: 'Pilar.' },
  PP: { code: 'PP', type: 'CAMPUR', desc: 'Aldiracita.' },
  PS: { code: 'PS', type: 'CAMPUR', desc: 'Paramitra.' },
  RG: { code: 'RG', type: 'CAMPUR', desc: 'Profindo.' },
  RO: { code: 'RO', type: 'CAMPUR', desc: 'NISP.' },
  RS: { code: 'RS', type: 'CAMPUR', desc: 'Yulie.' },
  YU: { code: 'YU', type: 'CAMPUR', desc: 'CIMB.' },
  KAF: { code: 'KAF', type: 'CAMPUR', desc: 'KAF Sekuritas.' },
};

export const SAMPLE_DATA = `**Net Income, EPS, Revenue**
Period | 2025 | 2024 | 2023
Q1 | 14,146 B | 12,879 B | 11,530 B
Q2 | 14,870 B | 13,997 B | 12,660 B
Q3 | 14,381 B | 14,198 B | 12,230 B
Q4 | 14,140 B | 13,762 B | 12,219 B
Annualised | 57,537 B | 54,836 B | 48,639 B
TTM (Q4) | 57,537 B | 54,836 B | 48,639 B

Dividend (TTM) | 305.00 | 300.00 | 270.00
Payout Ratio | 65.35% | 67.44% | 68.43%
Dividend Yield | 3.99% | 3.58% | 2.67%

Market Cap | 943,054 B
Current Shares Outstanding | 123.28 B
Free Float | 42.74%

**Valuation**
Current PE Ratio (Annualised) | 16.39
Current PE Ratio (TTM) | 16.39
Forward PE Ratio | 17.14
Current Price to Sales (TTM) | 7.95
Current Price to Book Value | 3.35
Current Price to Cashflow (TTM) | 12.17
Current Price to Free Cashflow (TTM) | 12.48
EV to EBITDA (TTM) | 12.00

**Per Share**
Current EPS (TTM) | 466.74
Current EPS (Annualised) | 466.74
Revenue Per Share (TTM) | 961.86
Cash Per Share (Quarter) | 205.27
Current Book Value Per Share | 2,283.24
Free Cashflow Per Share (TTM) | 613.21

**Solvency**
Current Ratio (Quarter) | -
Quick Ratio | -
Debt to Equity Ratio | -

**Profitability**
Return on Assets (TTM) | 3.63%
Return on Equity (TTM) | 20.44%
Gross Profit Margin (Quarter) | 87.75%
Operating Profit Margin (Quarter) | 64.45%
Net Profit Margin (Quarter) | 52.09%

**Dividend**
Dividend (TTM) | 305.00
Payout Ratio | 65.35%
Dividend Yield | 3.99%
Latest Dividend Ex-Date | 03 Dec 25

**Dividend History**
Period | Dividend | Ex-Date | Pay Date
2025 | 55.00 | 03 Dec 25 | 22 Dec 25
2024 | 250.00 | 21 Mar 25 | 11 Apr 25
2024 | 50.00 | 21 Nov 24 | 11 Dec 24
2023 | 227.50 | 25 Mar 24 | 04 Apr 24
2023 | 42.50 | 04 Dec 23 | 20 Dec 23
2022 | 170.00 | 29 Mar 23 | 14 Apr 23
2022 | 35.00 | 02 Dec 22 | 20 Dec 22
2021 | 120.00 | 28 Mar 22 | 19 Apr 22
2021 | 25.00 | 17 Nov 21 | 07 Dec 21
2020 | 432.00 | 08 Apr 21 | 28 Apr 21

**Income Statement**
Revenue (TTM) | 118,573 B
Gross Profit (TTM) | 105,208 B
EBITDA (TTM) | 73,716 B
Net Income (TTM) | 57,537 B

---

**Balance Sheet**
Cash (Quarter) | 25,305 B
Total Assets (Quarter) | 1,586,829 B
Total Liabilities (Quarter) | 1,305,141 B
Total Equity | 281,466 B

**Cash Flow Statement**
Cash From Operations (TTM) | 77,509 B
Cash From Investing (TTM) | (33,691 B)
Cash From Financing (TTM) | (41,709 B)
Capital Expenditure (TTM) | (1,915 B)
Free Cash Flow (TTM) | 75,594 B

**Growth**
Revenue (Quarter YoY Growth) | 1.77%
Revenue (YTD YoY Growth) | 5.14%
Revenue (Annual YoY Growth) | 5.14%
Net Income (Quarter YoY Growth) | 2.74%
Net Income (YTD YoY Growth) | 4.93%
Net Income (Annual YoY Growth) | 4.93%
EPS (Quarter YoY Growth) | 2.74%
EPS (YTD YoY Growth) | 4.93%
EPS (Annual YoY Growth) | 4.93%

---

Header:
- Open: 7,600
- Prev: 7,600
- High: 7,650
- Low: 7,375
- ARA: 9,175
- ARB: 6,525
- Lot: 2.06M
- Val: 1.567
- F Buy: 721.08B
- F Sell: 977.64B
- Avg: 7,549
- Freq: 50.03K

Lot Buy
1. 115
2. 4,286
3. 22,190
4. 31,281
5. 72,278
6. 32,420
7. 30,713
8. 43,622
9. 116,545
10. 31,663
Total Lot Buy: 838,183

Freq Buy
1. -
2. 155
3. 428
4. 848
5. 3,378
6. 1,026
7. 1,314
8. 1,008
9. 3,651
10. 1,208
Total Freq Buy: 23,736

Broker Summary (Net ON):
SQ 67.7B 90.7K 7,510 | KZ 151.3B 201.5K
XL 67.8B 88.3K 7,540 | YU 22.8B 29.9K
OO 48.5B 63.7K 7,601 | CC 19.5B 25.7K
CP 32B 42.5K 7,537 | 4K 19.4B 26.1K

=== Stats Matematis Komplit ===
Mean Return Harian: 0.001002
Std Dev Return (Volatilitas Harian): 0.018734
Sharpe Ratio Sederhana (Risk-Free 0): 0.0535
Annual Return Estimasi: 0.2872

=== Technical Indicators Terbaru ===
MA10: 7502.50
MA20: 7791.25
MA50: 8033.96
RSI14: 38.96
MACD: -179.12
Bollinger Upper: 8466.82
Bollinger Mid: 7791.25
Bollinger Lower: 7115.68`;
