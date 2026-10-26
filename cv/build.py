"""Generiše dve verzije CV-a (administracija i IT) iz zajedničkog šablona.

Pokretanje:  python3 build.py   ->  cv-admin.html, cv-it.html
PDF:         node render.js     ->  CV_Ognjen_Ivkovic_Administracija.pdf, CV_Ognjen_Ivkovic_IT.pdf
"""

CONTACT = """
    <h3>Kontakt</h3>
    <div class="contact">
      <div><span class="ic">☎</span><span>064 063 6715</span></div>
      <div><span class="ic">✉</span><span>ognjenivkovic1@gmail.com</span></div>
      <div><span class="ic">⌂</span><span>Mije Stanimirovića 30a<br>19000 Zaječar</span></div>
    </div>"""

LANGUAGES = """
    <h3>Jezici</h3>
    <div class="tool"><b>Srpski</b><small>Maternji jezik</small></div>
    <div class="tool"><b>Engleski – tečno</b><small>Slobodna komunikacija u govoru i pisanju</small></div>"""

INTERESTS = """
    <h3>Interesovanja</h3>
    <ul>
      <li>Auto-sport i motorsport</li>
      <li>Računari i nove tehnologije</li>
    </ul>"""

EXPERIENCE = """
    <section>
      <h2>Radno iskustvo</h2>
      <div class="item">
        <div class="top">
          <h4>Sekretar kluba</h4>
          <span class="date">Jul 2023 – danas</span>
        </div>
        <div class="org">ASK „Gaga Avala Racing Team“ i ASU „AS Zaječar“</div>
        <p class="lead">{lead}</p>
        <ul>
{bullets}
        </ul>
      </div>
    </section>"""

EDUCATION = """
    <section>
      <h2>Obrazovanje</h2>
      <div class="item">
        <div class="top">
          <h4>Elektrotehničar računara</h4>
          <span class="date">Sep 2019 – Jun 2023</span>
        </div>
        <div class="org">Tehnička škola, Zaječar</div>
        <ul>
{bullets}
        </ul>
      </div>
    </section>"""

VERSIONS = {
    "admin": {
        "role": "Administrativni sekretar",
        "summary": (
            "Od 2023. godine samostalno vodim administraciju dva auto-sportska kluba – od "
            "sportske i poslovne dokumentacije, preko evidencija, do saradnje sa knjigovodstvom "
            "i komunikacije sa takmičarima. Navikao sam na rokove i rad na terenu tokom trka. "
            "Tehničko obrazovanje i tečan engleski omogućavaju mi da brzo savladam nove programe "
            "i procedure. Tražim poziciju u administraciji ili kancelarijskom poslovanju."
        ),
        "lead": "Odgovoran za celokupno administrativno poslovanje oba kluba.",
        "experience": [
            "<b>Administracija:</b> priprema dopisa, zapisnika i ostale dokumentacije kluba; vođenje i uređivanje arhive.",
            "<b>Sportska dokumentacija:</b> licence takmičara, prijave za takmičenja i usklađenost sa pravilnicima, u saradnji sa nacionalnim savezom.",
            "<b>Organizacija trka:</b> prijave takmičara, logistika i podrška na licu mesta tokom takmičarske sezone, uz rad pod vremenskim pritiskom.",
            "<b>Komunikacija:</b> kontakt osoba za takmičare i članove – obaveštenja, rokovi i rešavanje tekućih problema.",
            "<b>Evidencije:</b> vođenje evidencije članstva, takmičenja i rezultata u digitalnom obliku.",
            "<b>Finansije:</b> priprema i blagovremeno dostavljanje dokumentacije knjigovodstvu.",
        ],
        "education_first": False,
        "education": [
            "Rad sa računarskim sistemima, softverom i kancelarijskim programima.",
            "Osnove programiranja, računarskih mreža i elektronike.",
        ],
        "tools": [
            ("MS Word", "Dopisi, zapisnici, šabloni dokumenata"),
            ("MS Excel", "Tabele, evidencije, formule i filteri"),
            ("E-pošta i onlajn alati", "Poslovna prepiska, deljenje dokumenata"),
            ("Rad na računaru", "Windows, skeniranje, štampa, rešavanje kvarova"),
        ],
        "tags": [
            "Administrativno poslovanje", "Poslovna korespondencija", "Vođenje evidencija",
            "Arhiviranje", "Organizacija događaja", "Komunikacija sa klijentima",
            "Saradnja sa knjigovodstvom", "Poštovanje rokova", "Rad pod pritiskom",
            "Samostalnost", "Timski rad", "Rešavanje problema",
        ],
    },
    "it": {
        "role": "Elektrotehničar računara · IT podrška",
        "summary": (
            "Elektrotehničar računara sa tri godine radnog iskustva u administraciji "
            "auto-sportskih klubova, gde svakodnevno radim sa dokumentacijom, digitalnim "
            "evidencijama i ljudima. Spajam tehničko znanje o hardveru, softveru i mrežama sa "
            "iskustvom u komunikaciji i rešavanju problema pod pritiskom. Tečno govorim engleski, "
            "što mi olakšava rad sa tehničkom dokumentacijom. Tražim poziciju u IT podršci ili "
            "kao računarski tehničar."
        ),
        "lead": "Samostalno vodim administraciju i digitalne evidencije oba kluba.",
        "experience": [
            "<b>Digitalna evidencija:</b> vođenje evidencije članstva, takmičenja i rezultata i uređivanje elektronske arhive.",
            "<b>Dokumentacija:</b> licence, prijave i pravilnici u saradnji sa nacionalnim savezom; dopisi i zapisnici kluba.",
            "<b>Rad na terenu:</b> prijave takmičara, logistika i podrška tokom trka – brzo rešavanje problema pod pritiskom.",
            "<b>Komunikacija:</b> kontakt osoba za takmičare i članove kluba.",
            "<b>Finansije:</b> priprema i dostavljanje dokumentacije knjigovodstvu.",
        ],
        "education_first": True,
        "education": [
            "<b>Hardver:</b> sklapanje, dijagnostika i održavanje računara.",
            "<b>Softver:</b> instalacija i podešavanje operativnih sistema i programa.",
            "<b>Mreže:</b> osnove računarskih mreža i mrežne opreme.",
            "<b>Elektronika i programiranje:</b> osnovna znanja.",
        ],
        "tools": [
            ("Hardver", "Sklapanje, dijagnostika, zamena komponenti"),
            ("Windows", "Instalacija, podešavanje, rešavanje problema"),
            ("Računarske mreže", "Osnove LAN-a, rutera i IP podešavanja"),
            ("MS Office", "Word, Excel, e-pošta"),
        ],
        "tags": [
            "Korisnička podrška", "Instalacija OS-a", "Održavanje računara",
            "Dijagnostika kvarova", "Osnove mreža", "Rad sa dokumentacijom",
            "Tehnički engleski", "Rešavanje problema", "Komunikacija",
            "Rad pod pritiskom", "Brzo učenje", "Timski rad",
        ],
    },
}


def li(items, indent=10):
    return "\n".join(f"{' ' * indent}<li>{x}</li>" for x in items)


def build(v):
    tools = "\n".join(f'    <div class="tool"><b>{n}</b><small>{d}</small></div>' for n, d in v["tools"])
    tags = "\n".join(f"        <span>{t}</span>" for t in v["tags"])
    exp = EXPERIENCE.format(lead=v["lead"], bullets=li(v["experience"]))
    edu = EDUCATION.format(bullets=li(v["education"]))
    sections = edu + exp if v["education_first"] else exp + edu
    return f"""<!doctype html>
<html lang="sr">
<head>
<meta charset="utf-8">
<title>CV – Ognjen Ivković</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="page">
  <aside>
    <div class="photo"><img src="foto.jpg" alt="Ognjen Ivković"></div>
{CONTACT}

    <h3>Alati i znanja</h3>
{tools}
{LANGUAGES}
{INTERESTS}
  </aside>

  <main>
    <header>
      <h1>Ognjen<br><b>Ivković</b></h1>
      <div class="role">{v["role"]}</div>
    </header>

    <p class="summary">{v["summary"]}</p>
{sections}

    <section>
      <h2>Kompetencije</h2>
      <div class="tags">
{tags}
      </div>
    </section>
  </main>
</div>
</body>
</html>
"""


if __name__ == "__main__":
    for key, v in VERSIONS.items():
        with open(f"cv-{key}.html", "w", encoding="utf-8") as f:
            f.write(build(v))
