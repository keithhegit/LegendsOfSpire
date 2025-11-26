import re

# Read the file
with open('src/data/cards.js', 'r', encoding='utf-8') as f:
    content = f.read()

# P0 Nerfs
content = re.sub(r"(GarenQ:.*?value:)8(,.*?hero:'Garen')", r"\g<1>6\g<2>", content)
content = re.sub(r"(GarenE:.*?value:)16(,.*?hero:'Garen')", r"\g<1>14\g<2>", content)
content = re.sub(r"(DariusQ:.*?value:)7(,.*?hero:'Darius')", r"\g<1>6\g<2>", content)
content = re.sub(r"(DariusR:.*?cost:3, value:)20(,.*?hero:'Darius')", r"\g<1>18\g<2>", content)
content = re.sub(r"(LuxQ:.*?value:)9(,.*?hero:'Lux')", r"\g<1>8\g<2>", content)
content = re.sub(r"(LuxR:.*?cost:3, value:)30(,.*?hero:'Lux')", r"\g<1>28\g<2>", content)

# P0 Buffs
content = re.sub(r"(ZedQ:.*?value:)9(,.*?hero:'Zed')", r"\g<1>11\g<2>", content)
content = re.sub(r"(ZedW:.*?effectValue:)50(,)", r"\g<1>75\g<2>", content)
content = re.sub(r"(ZedE:.*?value:)6(,.*?hero:'Zed')", r"\g<1>8\g<2>", content)
content = re.sub(r"(TeemoQ:.*?value:)6(,.*?hero:'Teemo')", r"\g<1>10\g<2>", content)
content = re.sub(r"(TeemoE:.*?effect:'POISON', effectValue:)3(,)", r"\g<1>7\g<2>", content)
content = re.sub(r"(TeemoR:.*?effect:'MUSHROOM_MARK', effectValue:)12(,)", r"\g<1>15\g<2>", content)
content = re.sub(r"(KatarinaQ:.*?value:)9(,.*?hero:'Katarina')", r"\g<1>10\g<2>", content)
content = re.sub(r"(KatarinaW:.*?value:)8(,.*?hero:'Katarina')", r"\g<1>9\g<2>", content)
content = re.sub(r"(KatarinaE:.*?value:)6(,.*?hero:'Katarina')", r"\g<1>7\g<2>", content)
content = re.sub(r"(VayneQ:.*?cost:0, value:)4(,.*?hero:'Vayne')", r"\g<1>6\g<2>", content)
content = re.sub(r"(VaynePassive:.*?effectValue:)12(,)", r"\g<1>15\g<2>", content)
content = re.sub(r"(VayneE:.*?value:)6(,.*?hero:'Vayne')", r"\g<1>8\g<2>", content)
content = re.sub(r"(CardMasterQ:.*?value:)6(,.*?hero:'CardMaster')", r"\g<1>8\g<2>", content)
content = re.sub(r"(CardMasterW:.*?cost:1, value:)6(,.*?hero:'CardMaster')", r"\g<1>7\g<2>", content)

# P1 Nerfs
content = re.sub(r"(JinxQ:.*?value:)9(,.*?hero:'Jinx')", r"\g<1>8\g<2>", content)
content = re.sub(r"(JinxW:.*?value:)10(,.*?hero:'Jinx')", r"\g<1>9\g<2>", content)
content = re.sub(r"(UrgotQ:.*?value:)7(,.*?hero:'Urgot')", r"\g<1>6\g<2>", content)
content = re.sub(r"(UrgotR:.*?cost:3, value:)30(,.*?hero:'Urgot')", r"\g<1>29\g<2>", content)

# P1 Buffs
content = re.sub(r"(IreliaQ:.*?value:)6(,.*?hero:'Irelia')", r"\g<1>8\g<2>", content)
content = re.sub(r"(IreliaE:.*?value:)8(,.*?hero:'Irelia')", r"\g<1>9\g<2>", content)
content = re.sub(r"(IreliaR:.*?cost:3, value:)12(,.*?hero:'Irelia')", r"\g<1>13\g<2>", content)
content = re.sub(r"(EkkoQ:.*?value:)6(,.*?hero:'Ekko')", r"\g<1>7\g<2>", content)
content = re.sub(r"(EkkoE:.*?value:)8(,.*?hero:'Ekko')", r"\g<1>9\g<2>", content)

# Write back
with open('src/data/cards.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ All 28 balance adjustments applied successfully!")
