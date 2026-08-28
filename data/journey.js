// Kapitel 1 – Ankunft in Kathmandu: die Geschichte der ersten Reise-Etappe.
// Szene 4 (Taxi) laeuft auf STORY1 weiter (steps werden in der Session verbunden).
window.CHAPTER1 = {
  id: "chap1",
  title: "Ankunft in Kathmandu",
  scenes: [
    {
      id: "c1s1", title: "Landung", art: "airport", xpBonus: 15,
      intro: "Nach zehn Stunden Flug setzt das Flugzeug endlich auf – Willkommen in Kathmandu! Im Terminal drängeln sich Menschen, Lautsprecher rappeln auf Nepali. Erstmal durchatmen: नमस्ते!",
      reveal: { q: "Wie heißt nochmal der Flughafen auf Nepali?", a: "विमानस्थल (bimaanasthal)" },
      items: ["l9_01", "l9_02", "l9_03"],
      warmups: ["l1_01", "l1_11"],
      choice: {
        q: "Du willst raus aus dem Terminal. Was fragst du?",
        options: [
          { ne: "निस्कने ढोका कहाँ हो?", tr: "niskane dhaato kaha ho?", correct: true, why: "Genau – „Wo ist der Ausgang?“ bring dich nach draußen." },
          { ne: "कति बजे?", tr: "kati baje?", why: "„Wie spät ist es?“ hilft dir später – erst mal raus hier!", correct: false },
          { ne: "नमस्ते", tr: "namaste", why: "Freundlich! aber der Ausgang ist trotzdem noch nicht gefunden." }
        ]
      }
    },
    {
      id: "c1s2", title: "Geld wechseln", art: "money", xpBonus: 15,
      intro: "Vor dem Terminal wartet der Geldwechsler-Schalter. Aus Euro werden Rupien – und plötzlich bist du Millionär. Zumindest auf dem Papier.",
      reveal: { q: "Wie heißt die nepalesische Währung?", a: "रुपैयाँ (rupaiya)" },
      items: ["l9_04", "l9_05", "l2_01", "l2_02"],
      warmups: ["l1_01", "l1_11"],
      choice: {
        q: "Am Schalter fragst du nach dem Wechselplatz. Was sagst du?",
        options: [
          { ne: "पैसा फेर्ने ठाउँ कहाँ छ?", tr: "paisa pherne thau kaha chha?", correct: true, why: "Richtig – so findest du den Schalter." },
          { ne: "एक, दुई, तीन", tr: "ek, dui, tin", why: "Die Zahlen brauchst du gleich zum Zählen – aber die Frage war eine andere.", correct: false },
          { ne: "मीठो!", tr: "mitho!", why: "„Lecker!“ – hoffentlich nicht zur Rupie gesagt." }
        ]
      }
    },
    {
      id: "c1s3", title: "Der Weg zum Taxi", art: "directions", xpBonus: 15,
      intro: "Mit frischen Rupien in der Tasche geht es raus. Irgendwo hier muss der Taxi-Stand sein – links? Rechts? Geradeaus? Zeit für die ersten Richtungen.",
      reveal: { q: "Wie fragst du nach einem Taxi?", a: "ट्याक्सी कहाँ छ? (tyaksi kaha chha?)" },
      items: ["l9_06", "l4_05", "l4_06", "l4_07"],
      warmups: ["l9_03", "l9_02"],
      choice: {
        q: "Ein freundlicher Mann zeigt dir den Weg. Er sagt „दायाँ“ – wo gehst du hin?",
        options: [
          { ne: "दायाँ", tr: "daayaa", correct: true, why: "दायाँ = rechts. Du bist auf dem richtigen Weg." },
          { ne: "बायाँ", tr: "baayaa", why: "Links wäre बायाँ – der Mann meinte aber rechts.", correct: false },
          { ne: "सिधा", tr: "sidha", why: "Geradeaus ist सिधा – das kam nicht vor." }
        ]
      }
    },
    {
      id: "c1s4", title: "Hotel-Check-in", art: "hotel", xpBonus: 20,
      intro: "Erste Nacht in Kathmandu: Hinter der Hotel-Rezeption wartet die letzte Aufgabe des Tages – einchecken, auf Nepali.",
      reveal: { q: "Wie sagst du, dass du ein Zimmer brauchst?", a: "एउटा कोठा चाहियो। (eutaa kotha chahiyo.)" },
      items: ["l9_08", "l9_09", "l9_10", "l9_11"],
      warmups: ["l1_13", "l1_15"],
      choice: {
        q: "An der Rezeption sagst du, dass du reserviert hast. Was sagst du?",
        options: [
          { ne: "बुक गरेको छु।", tr: "buk gareko chhu.", correct: true, why: "Perfekt – „Ich habe reserviert“, und der Schlüssel ist dein." },
          { ne: "एउटा कोठा चाहियो।", tr: "eutaa kotha chahiyo.", correct: false, why: "Auch gut – aber die Frage war, ob du reserviert HAST." },
          { ne: "म डाक्टर चाहियो।", tr: "ma doctor chahiyo.", correct: false, why: "Hoffentlich nicht nötig nach dem ersten Tag!" }
        ]
      }
    },
    {
      id: "c1s5", title: "Im Taxi nach Thamel", art: "taxi", xpBonus: 25, useStory1: true,
      intro: "Ausgeruht geht es am Morgen weiter: rein ins Taxi, Ziel Thamel – deine Basis für die nächsten Tage. Sag dem Fahrer, wo es hingeht – und wo du herkommst.",
      items: ["l9_07", "l8_11"],
      warmups: ["l1_15", "l9_06"]
    }
  ]
};

// Kapitel 2 – Thamel: Deine Basis im Getümmel
window.CHAPTER2 = {
  id: "chap2", title: "Thamel – deine Basis",
  scenes: [
    {
      id: "c2s1", title: "Erstes Frühstück", art: "cafe", xpBonus: 15,
      intro: "Erster Morgen in Thamel. Überall riecht es nach Tee und Zimt – Zeit fürs erste Frühstück auf Nepali.",
      reveal: { q: "Wie bestellst du einen Tee?", a: "चिया दिनुहोस्। (chiya dinuhos.)" },
      items: ["l10_01", "l10_02", "l10_03"],
      warmups: ["l1_01", "l9_03"],
      choice: {
        q: "Der Kellner fragt, was du magst. Was sagst du?",
        options: [
          { ne: "चिया दिनुहोस्।", tr: "chiya dinuhos.", correct: true, why: "Perfekt – Tee, bitte. Das Bestell-Muster für alles." },
          { ne: "बिल दिनुहोस्।", tr: "bila dinuhos.", correct: false, why: "Die Rechnung kommt zum Schluss – erst genießen!" },
          { ne: "नमस्ते", tr: "namaste", correct: false, why: "Freundlich begrüßt hast du schon – jetzt gehts ums Bestellen." }
        ]
      }
    },
    {
      id: "c2s2", title: "Auf dem Basar", art: "bazar", xpBonus: 15,
      intro: "Der Basar von Thamel: Gewürze, Decken, Klingelnde Radläufe. Hier lernst du das wichtigste Wort jedes Markts – und wie man feilscht.",
      reveal: { q: "Was heißt बजार?", a: "bajaar = Basar, Markt" },
      items: ["l10_06", "l8_02", "l8_03"],
      warmups: ["l2_01", "l2_02", "l2_11"],
      choice: {
        q: "Der Händler nennt einen Preis, der ist zu hoch. Was sagst du?",
        options: [
          { ne: "एकदम महँगो भयो!", tr: "ekdam mahango bhayo!", correct: true, why: "„Viel zu teuer!“ – so beginnt jede Verhandlung in Nepal." },
          { ne: "मीठो छ!", tr: "mitho chha!", correct: false, why: "„Lecker!“ passt zum Essen, nicht zum Preis." },
          { ne: "यो कति पर्छ?", tr: "yo kati parchha?", correct: false, why: "Gute Frage – aber den Preis kennst du ja schon, er ist zu hoch!" }
        ]
      }
    },
    {
      id: "c2s3", title: "Wegbeschreibung", art: "directions", xpBonus: 15,
      intro: "Verlaufen im Gassengewirr? Keine Panik – du hast ja deine Richtungs-Wörter dabei. Heute ohne neue Wörter: nur du und der Weg.",
      reveal: { q: "Was heißt सिधा?", a: "sidha = geradeaus" },
      items: [],
      warmups: ["l4_05", "l4_06", "l4_07", "l9_06"],
      choice: {
        q: "Du fragst nach dem Café. Jemand sagt: „सिधा जानुहोस्।“ – was tust du?",
        options: [
          { ne: "सिधा जानुहोस्", tr: "sidha jaanuhos", correct: true, why: "Genau – geradeaus gehen. Du kennst beide Wörter schon!" },
          { ne: "दायाँ जानुहोस्", tr: "daayaa jaanuhos", correct: false, why: "दायाँ wäre rechts – gesagt wurde सिधा, geradeaus." },
          { ne: "बायाँ जानुहोस्", tr: "baayaa jaanuhos", correct: false, why: "बायाँ wäre links – gesagt wurde सिधा." }
        ]
      }
    },
    {
      id: "c2s4", title: "Abend in Thamel", art: "cafe", xpBonus: 20,
      intro: "Der Tag klingt aus, Laterne an, noch einmal zum Essen. Danach weißt du: Thamel ist deine Basis – hier kommst du immer zurück.",
      reveal: { q: "Wie bestellst du die Rechnung?", a: "बिल दिनुहोस्। (bila dinuhos.)" },
      items: ["l10_04", "l10_05", "l10_07"],
      warmups: ["l10_01", "l8_02"],
      choice: {
        q: "Beim Bezahlen grinst der Kellner: „Sie sprechen schon Nepali!“ Was antwortest du?",
        options: [
          { ne: "म यहाँ बस्छु।", tr: "ma yahaa baschhu.", correct: true, why: "„Ich wohne hier“ – in Thamel gehörst du jetzt ein bisschen dazu." },
          { ne: "पैसा दिनुहोस्।", tr: "paisa dinuhos.", correct: false, why: "„Geld, bitte!“ – höflich ist was anderes beim Bezahlen." },
          { ne: "बजार", tr: "bajaar", correct: false, why: "Der Basar schläft schon – und ein Wort ist kein Satz." }
        ]
      }
    }
  ]
};

// Kapitel 3 – Swayambhu: Der Affentempel
window.CHAPTER3 = {
  id: "chap3", title: "Swayambhu – der Affentempel",
  scenes: [
    {
      id: "c3s1", title: "Der Aufstieg", art: "stupa", xpBonus: 15,
      intro: "Ein Berg aus Stein und Stufen, oben die Augen des Buddha, überall Affen. Swayambhu ruft – du steigst hinauf.",
      reveal: { q: "Was heißt मन्दिर?", a: "mandir = Tempel" },
      items: ["l11_07", "l11_01", "l11_02"],
      warmups: ["l10_01", "l9_07"],
      choice: {
        q: "Halbwegs ruhen dich die Stein-Stufen aus. Ein Affe schaut dich an. Was ist das?",
        options: [
          { ne: "बानर", tr: "baanar", correct: true, why: "Ein Affe! Swayambhu ist voll von ihnen – freundlich, aber knackig." },
          { ne: "मन्दिर", tr: "mandir", correct: false, why: "Das Tempel-Dach kommt erst oben – das hier ist ein Affe." },
          { ne: "ढुङ्गा", tr: "dhunga", correct: false, why: "Aus Stein sind die Stufen – das Tier darauf heißt anders." }
        ]
      }
    },
    {
      id: "c3s2", title: "Gebetsmühlen & Fahnen", art: "stupa", xpBonus: 15,
      intro: "Oben drehst du die Gebetsmühlen, im Wind flattern die bunten Fahnen. Alles hier ist langsam und ruhig – शान्त.",
      reveal: { q: "Was heißt शान्त?", a: "shaanta = ruhig" },
      items: ["l11_05", "l11_04"],
      warmups: ["l1_08", "l1_05"],
      choice: {
        q: "Ein Mönch nickt dir zu. Du willst respektvoll wirken. Welches Wort passt zu diesem Ort?",
        options: [
          { ne: "शान्त", tr: "shaanta", correct: true, why: "Ruhe – genau das Gefühl hier oben." },
          { ne: "गरम", tr: "garam", correct: false, why: "„Heiß“ – eher der Tee unten am Berg, nicht die Stimmung." },
          { ne: "मीठो", tr: "mitho", correct: false, why: "„Lecker“ – für Essen, nicht für Tempel-Ruhe." }
        ]
      }
    },
    {
      id: "c3s3", title: "Blick über die Stadt", art: "sunset", xpBonus: 20,
      intro: "Von der Plattform siehst du die ganze Stadt im Dunst liegen. Irgendwo da unten ist dein Zimmer – und morgen geht die Reise weiter.",
      reveal: { q: "Wie heißt die Stadt auf Nepali?", a: "शहर (shahar)" },
      items: ["l11_03", "l11_06"],
      warmups: ["l11_01", "l10_05"],
      choice: {
        q: "Ein Reisender will den Blick auch sehen. Was sagst du ihm?",
        options: [
          { ne: "देख्नुहोस्!", tr: "dekhnuhos!", correct: true, why: "„Schauen Sie!“ – die höfliche Form, wie bei जानुहोस्." },
          { ne: "बानर!", tr: "baanar!", correct: false, why: "Achtung, Affe! – aber der Blick war die Antwort." },
          { ne: "शहर", tr: "shahar", correct: false, why: "Richtiges Wort, aber als Ausruf fehlt der Gruß drumherum." }
        ]
      }
    }
  ]
};

// Kapitel 4 – Bhaktapur: Die rote Stadt
window.CHAPTER4 = {
  id: "chap4", title: "Bhaktapur – die rote Stadt",
  scenes: [
    {
      id: "c4s1", title: "Ankunft in der Altstadt", art: "oldtown", xpBonus: 15,
      intro: "Der Bus setzt dich vor einem riesigen alten Tor ab. Rote Ziegel, engen Gassen, Zeit aus einem anderen Jahrhundert.",
      reveal: { q: "Was heißt ढोका?", a: "dhaakaa = Tor" },
      items: ["l12_01", "l12_02", "l12_03"],
      warmups: ["l11_03", "l10_06"],
      choice: {
        q: "Du gehst durch das alte Tor. Was war das gerade?",
        options: [
          { ne: "ढोका", tr: "dhaakaa", correct: true, why: "Das Tor – wie im „Ausgang“ vom Flughafen, nur größer." },
          { ne: "गाउँ", tr: "gaaun", correct: false, why: "Das Städtchen liegt dahinter – das Tor ist die Tür zu ihm." },
          { ne: "शहर", tr: "shahar", correct: false, why: "Die große Stadt war Kathmandu – hier steht das Dorf-Wort bereit." }
        ]
      }
    },
    {
      id: "c4s2", title: "Der Töpfermeister", art: "oldtown", xpBonus: 15,
      intro: "In einer Gasse dreht sich die Töpferscheibe. Aus roter Erde werden Schalen, Tassen, Elefanten. Der Meister zeigt es dir – ganz langsam.",
      reveal: { q: "Was heißt माटो?", a: "maato = Ton, Erde" },
      items: ["l12_04"],
      warmups: ["l12_03", "l11_07"],
      choice: {
        q: "Der Meister fragt, ob die Schüssel aus Ton gut geworden ist. Was sagst du ehrlich?",
        options: [
          { ne: "राम्रो!", tr: "raamro!", correct: true, why: "„Schön!“ – das alte Bekannte aus Lektion 1, hier Gold wert." },
          { ne: "पुरानो", tr: "puraano", correct: false, why: "„Alt“ ist die Stadt – die frische Schüssel ist raamro." },
          { ne: "खुशी", tr: "khushi", correct: false, why: "Fast – Freude fühlst du, aber das Lob heißt raamro." }
        ]
      }
    },
    {
      id: "c4s3", title: "Abschied vom Tal", art: "sunset", xpBonus: 20,
      intro: "Abendlicht über den Dächern, morgen früh geht es weiter ins Gebirge. Ein letzter chai, ein letzter Blick – dann: Nagarkot.",
      reveal: { q: "Was heißt बिहान?", a: "bihana = Morgen" },
      items: ["l12_05", "l12_06", "l12_07"],
      warmups: ["l1_05", "l11_04"],
      choice: {
        q: "Wie fühlst du dich beim Abschied vom Kathmandu-Tal?",
        options: [
          { ne: "खुशी", tr: "khushi", correct: true, why: "Freude – du hast geschafft, was vor zwei Tagen undenkbar war." },
          { ne: "बेलुका", tr: "beluka", correct: false, why: "Der Abend ist die Zeit, nicht das Gefühl." },
          { ne: "शान्त", tr: "shaanta", correct: false, why: "Ruhig war der Tempel – jetzt ist Freudengefühl angesagt." }
        ]
      }
    }
  ]
};


// Kapitel 5 – Nagarkot: Sonnenaufgang
window.CHAPTER5 = {
  id: "chap5", title: "Nagarkot – Sonnenaufgang",
  scenes: [
    {
      id: "c5s1", title: "Der frühe Bus", art: "sunrise", xpBonus: 15,
      intro: "Vier Uhr morgens. Wer den Sonnenaufgang überm Himalaya sehen will, muss schnell sein – छिटो!",
      reveal: { q: "Was heißt छिटो?", a: "chhito = schnell" },
      items: ["l13_01", "l13_02"],
      warmups: ["l4_01", "l12_05"],
      choice: {
        q: "Der Busfahrer wartet nicht lange. Was ruft er?",
        options: [
          { ne: "छिटो! छिटो!", tr: "chhito! chhito!", correct: true, why: "„Schnell, schnell!“ – der häufigste Ruf Nepals am frühen Morgen." },
          { ne: "ढिलो", tr: "dhilo", correct: false, why: "„Langsam“ – damit verpasst du den Sonnenaufgang garantiert." },
          { ne: "बिहान", tr: "bihana", correct: false, why: "Der Morgen ist schon da – jetzt zählt die Geschwindigkeit." }
        ]
      }
    },
    {
      id: "c5s2", title: "Warten auf das Licht", art: "sunrise", xpBonus: 15,
      intro: "Oben auf dem Hügel: Kälte, Tee aus Thermoskannen, und alle Blicke gehen in denselben Himmel.",
      reveal: { q: "Was heißt आकाश?", a: "aakaash = Himmel" },
      items: ["l13_03", "l13_04"],
      warmups: ["l5_06", "l5_01"],
      choice: {
        q: "Vor dir zieht eine Wolke vorbei. Was ist das?",
        options: [
          { ne: "बादल", tr: "baadal", correct: true, why: "Eine Wolke – hoffentlich zieht sie weiter, bevor die Sonne kommt." },
          { ne: "आकाश", tr: "aakaash", correct: false, why: "Der Himmel ist das Ganze da oben – die Wolke ist nur ein Stück davon." },
          { ne: "सूर्य", tr: "surya", correct: false, why: "Die Sonne kommt gleich – das hier war eine Wolke." }
        ]
      }
    },
    {
      id: "c5s3", title: "Über den Wolken", art: "sunrise", xpBonus: 20,
      intro: "Dann bricht das Licht über den Schneegipfeln auf – und du verstehst, warum Menschen für diesen Moment aufstehen.",
      reveal: { q: "Was heißt सुन्दर?", a: "sundar = wunderschön" },
      items: ["l13_05"],
      warmups: ["l13_03", "l13_04"],
      choice: {
        q: "Wie beschreibst du den Moment?",
        options: [
          { ne: "सुन्दर!", tr: "sundar!", correct: true, why: "Wunderschön – das Wort für genau diesen Sonnenaufgang." },
          { ne: "राम्रो", tr: "raamro", correct: false, why: "Auch richtig – aber für DIESEN Moment gibt was Größeres: sundar." },
          { ne: "गरम", tr: "garam", correct: false, why: "Heiß? Bei diesem Frost? Eher nicht." }
        ]
      }
    }
  ]
};

// Kapitel 6 – Pokhara: Am Phewa-See
window.CHAPTER6 = {
  id: "chap6", title: "Pokhara – am See",
  scenes: [
    {
      id: "c6s1", title: "Ankunft am See", art: "lake", xpBonus: 15,
      intro: "Nach den Bergen eine andere Welt: ein See, so ruhig, dass sich die Berge darin spiegeln.",
      reveal: { q: "Was heißt ताल?", a: "taal = See" },
      items: ["l14_01", "l14_02"],
      warmups: ["l5_05", "l3_02"],
      choice: {
        q: "Am Ufer liegen bunte Boote. Was ist das?",
        options: [
          { ne: "डुङ्गा", tr: "dungaa", correct: true, why: "Ein Boot – gleich fährst du damit raus." },
          { ne: "ताल", tr: "taal", correct: false, why: "Der See ist das ganze Wasser – gemeint waren die Boote darauf." },
          { ne: "नदी", tr: "nadi", correct: false, why: "Ein Fluss fließt – der See liegt still." }
        ]
      }
    },
    {
      id: "c6s2", title: "Bootsfahrt", art: "lake", xpBonus: 15,
      intro: "Ruhiges Paddeln, Kreisende Vögel, und unter dirziehen Fische vorbei. Die Berge schauen zu.",
      reveal: { q: "Was heißt माछा?", a: "maachha = Fisch" },
      items: ["l14_03"],
      warmups: ["l14_01", "l14_02"],
      choice: {
        q: "Im Wasser unter dir glitzert etwas Silbernes. Was schwimmt da?",
        options: [
          { ne: "माछा", tr: "maachha", correct: true, why: "Fische – der See ist voll davon." },
          { ne: "चरा", tr: "chara", correct: false, why: "Vögel fliegen über dem See, nicht durch ihn." },
          { ne: "पानी", tr: "paani", correct: false, why: "Wasser ist alles um dich herum – gemeint war das Tier." }
        ]
      }
    },
    {
      id: "c6s3", title: "Café mit Bergblick", art: "cafe", xpBonus: 20,
      intro: "Der Tag endet in einem Café am Ufer, die Füße hoch, die Annapurnas im Blick. Verdiente Erholung – आराम.",
      reveal: { q: "Was heißt आराम?", a: "aaraam = Ruhe, Erholung" },
      items: ["l14_04"],
      warmups: ["l10_01", "l10_03"],
      choice: {
        q: "Wie fühlst du dich nach diesem Tag?",
        options: [
          { ne: "आराम", tr: "aaraam", correct: true, why: "Völlige Ruhe – Pokhara ist der Erholungsort schlechthin." },
          { ne: "छिटो", tr: "chhito", correct: false, why: "Schnell war der Morgen in Nagarkot – hier zählt das Gegenteil." },
          { ne: "चिसो", tr: "chiso", correct: false, why: "Kalt wars in der Nacht – das Gefühl hier ist Erholung." }
        ]
      }
    }
  ]
};

// Kapitel 7 – Lumbini: Der Garten
window.CHAPTER7 = {
  id: "chap7", title: "Lumbini – der Garten",
  scenes: [
    {
      id: "c7s1", title: "Der Garten", art: "lotus", xpBonus: 15,
      intro: "Lumbini: der Ort, an dem Buddha geboren wurde. Ein Garten voller Bäume, Teiche und Blumen – und eine Stille, die man hören kann.",
      reveal: { q: "Was heißt फूल?", a: "phool = Blume" },
      items: ["l15_01", "l15_02"],
      warmups: ["l14_01", "l11_01"],
      choice: {
        q: "Im Teich schwimmen rosa Blüten. Was sind das?",
        options: [
          { ne: "फूल", tr: "phool", correct: true, why: "Blumen – in Lumbini überall, besonders die Lotusblüten." },
          { ne: "रूख", tr: "ruukh", correct: false, why: "Bäume stehen am Ufer – im Wasser schwimmen Blumen." },
          { ne: "माछा", tr: "maachha", correct: false, why: "Fische gibt es auch – aber rosa Blüten sind Blumen." }
        ]
      }
    },
    {
      id: "c7s2", title: "Die Stille", art: "lotus", xpBonus: 15,
      intro: "Pilger aus aller Welt sitzen im Schatten, Augen geschlossen. Hier lernt Nepal sein ruhigstes Wort.",
      reveal: { q: "Was heißt ध्यान?", a: "dhyaan = Meditation, Stille" },
      items: ["l15_03", "l15_04"],
      warmups: ["l11_05", "l11_01"],
      choice: {
        q: "Wer wurde hier geboren?",
        options: [
          { ne: "बुद्ध", tr: "buddha", correct: true, why: "Buddha – deshalb kommen die Pilger aus aller Welt hierher." },
          { ne: "बानर", tr: "baanar", correct: false, why: "Affen gibt es in Swayambhu – hier regiert die Stille." },
          { ne: "बाघ", tr: "baagh", correct: false, why: "Tiger leben im Dschungel von Chitwan, nicht im heiligen Garten." }
        ]
      }
    },
    {
      id: "c7s3", title: "Ein Mönch nickt dir zu", art: "lotus", xpBonus: 20,
      intro: "Beim Abschied nickt dir ein alter Mönch zu. Du nickst zurück – manche Gespräche brauchen keine Wörter. Und doch: ein paar Basis-Wörter nimmst du mit.",
      reveal: { q: "Was war das ruhigste Wort dieser Reise?", a: "शान्त (shaanta) – ruhig" },
      items: [],
      warmups: ["l11_05", "l15_03", "l1_02"],
      choice: {
        q: "Du willst dem Mönch danken. Was sagst du?",
        options: [
          { ne: "धन्यवाद", tr: "dhanyabaad", correct: true, why: "Danke – das erste große Wort der Reise, hier am ruhigsten Ort." },
          { ne: "नमस्ते", tr: "namaste", correct: false, why: "Auch schön zum Abschied – aber gefragt war der Dank." },
          { ne: "खुशी", tr: "khushi", correct: false, why: "Freude fühlst du – gesagt haben willst du danke." }
        ]
      }
    }
  ]
};

// Kapitel 8 – Chitwan: Im Dschungel
window.CHAPTER8 = {
  id: "chap8", title: "Chitwan – im Dschungel",
  scenes: [
    {
      id: "c8s1", title: "Die Safari", art: "jungle", xpBonus: 15,
      intro: "Zurück ins Getümmel: Der Jeep rumpelt in den Dschungel. Hohes Gras, heiße Luft – und irgendwo da draußen: Tiger.",
      reveal: { q: "Was heißt जनावर?", a: "janaawar = Tier" },
      items: ["l16_03", "l16_01"],
      warmups: ["l5_04", "l16_02"],
      choice: {
        q: "Vor dir graut etwas Riesiges durchs Gras – ein grauer Riese mit Rüssel. Was ist das?",
        options: [
          { ne: "हात्ती", tr: "haatti", correct: true, why: "Ein Elefant! In Chitwan leben wild lebende und Arbeitselefanten." },
          { ne: "बाघ", tr: "baagh", correct: false, why: "Tiger sind gestreift und schleichen – der Graue mit Rüssel ist ein Elefant." },
          { ne: "जनावर", tr: "janaawar", correct: false, why: "Stimmt – aber die genaue Antwort heißt haatti." }
        ]
      }
    },
    {
      id: "c8s2", title: "Das Nashorn", art: "jungle", xpBonus: 15,
      intro: "Am Flussufer: ein Panzernashorn im Schlamm. Dein Guide flüstert: सावधान! Vorsicht – du kennst das Wort schon.",
      reveal: { q: "Was heißt सावधान?", a: "saavadhaan = Vorsicht!" },
      items: ["l16_02"],
      warmups: ["l7_09", "l5_05"],
      choice: {
        q: "Das Nashorn schaut hoch. Was macht dein Guide?",
        options: [
          { ne: "सावधान!", tr: "saavadhaan!", correct: true, why: "Vorsicht! – Notfall-Wort aus Kapitel 1, hier Gold wert." },
          { ne: "छिटो!", tr: "chhito!", correct: false, why: "Schnell wegrennen? Beim Nashorn gilt: ruhig bleiben, laut sein." },
          { ne: "मीठो!", tr: "mitho!", correct: false, why: "Lecker? Bitte nicht das Nashorn anfassen." }
        ]
      }
    },
    {
      id: "c8s3", title: "Lagerfeuer", art: "jungle", xpBonus: 20,
      intro: "Abends am Lagerfeuer, Funken steigen in die Nacht. Der Guide erzählt von Tigern – du hörst zu, verstehst Brocken, und fühlst dich mittendrin.",
      reveal: { q: "Was heißt आगो?", a: "aago = Feuer" },
      items: ["l16_04"],
      warmups: ["l5_07", "l16_03"],
      choice: {
        q: "Was knistert da vor dir in der Nacht?",
        options: [
          { ne: "आगो", tr: "aago", correct: true, why: "Das Feuer – der warme Mittelpunkt jedes Dschungel-Abends." },
          { ne: "बादल", tr: "baadal", correct: false, why: "Wolken sind oben – das Knistern kommt vom Feuer." },
          { ne: "रात", tr: "raat", correct: false, why: "Die Nacht ist die Zeit – das Feuer ist das Ding davor." }
        ]
      }
    }
  ]
};

// Kapitel 9 – Everest Base Camp: Das Dach der Welt
window.CHAPTER9 = {
  id: "chap9", title: "Everest – das Dach der Welt",
  scenes: [
    {
      id: "c9s1", title: "Der letzte Weg", art: "summit", xpBonus: 15,
      intro: "Der Anfang vom Ende: Staubpfade, Hängebrücken, Gebetsfahnen im Wind. Und immer höher der Schnee.",
      reveal: { q: "Was heißt हिउँ?", a: "hiun = Schnee" },
      items: ["l17_01", "l17_02"],
      warmups: ["l5_01", "l5_03"],
      choice: {
        q: "Unter euch rauscht klares Wasser vom Gletscher. Was ist das?",
        options: [
          { ne: "खोला", tr: "kholaa", correct: true, why: "Ein Bach – hier oben geboren aus Schnee und Eis." },
          { ne: "ताल", tr: "taal", correct: false, why: "Ein See liegt still – das hier fließt und rauscht." },
          { ne: "हिउँ", tr: "hiun", correct: false, why: "Schnee ist weiß und liegt – das Wasser heißt kholaa." }
        ]
      }
    },
    {
      id: "c9s2", title: "Dünne Luft", art: "summit", xpBonus: 15,
      intro: "Jeder Schritt zählt, die Luft wird dünn. Kein neues Wort heute – nur du, dein Atem, und das alte बिस्तारै: langsam, langsam.",
      reveal: { q: "Wie heißt nochmal „langsam“?", a: "बिस्तारै (bistaarai) – du kennst es von „Sprechen Sie langsamer“" },
      items: [],
      warmups: ["l1_16", "l5_03", "l13_02"],
      choice: {
        q: "Dein Sherpa sagt: बिस्तारै! Was bedeutet das für dich?",
        options: [
          { ne: "बिस्तारै", tr: "bistaarai", correct: true, why: "Genau – hier oben ist langsam das klügste Tempo der Welt." },
          { ne: "छिटो!", tr: "chhito!", correct: false, why: "Schnell ist hier oben gefährlich – bistaarai heißt langsam." },
          { ne: "बिस्तारै बोल्नुहोस्", tr: "bistaarai bolnuhos", correct: false, why: "„Sprechen Sie langsamer“ – kennst du! Aber der Sherpa meint das Gehen." }
        ]
      }
    },
    {
      id: "c9s3", title: "Base Camp!", art: "summit", xpBonus: 20,
      intro: "Gelbe Zelte, bunte Fahnen, und über allem: der Everest. Du bist angekommen – am Dach der Welt.",
      reveal: { q: "Was heißt झन्डा?", a: "jhandaa = Fahne" },
      items: ["l17_03"],
      warmups: ["l17_01", "l12_07"],
      choice: {
        q: "Im Wind flattern Dutzend bunte Fahnen über dem Camp. Was weht da?",
        options: [
          { ne: "झन्डा", tr: "jhandaa", correct: true, why: "Fahnen – die Gebetsfahnen segnen den Weg für alle, die nach dir kommen." },
          { ne: "बादल", tr: "baadal", correct: false, why: "Wolken ziehen hoch oben – das Bunte am Seil sind Fahnen." },
          { ne: "चरा", tr: "chara", correct: false, why: "Vögel fliegen so hoch oben kaum – hier wehen Fahnen." }
        ]
      }
    },
    {
      id: "c9s4", title: "Das Finale", art: "summit", xpBonus: 30,
      intro: "Abends sitzt du vor dem Zelt, der Himmel voller Sterne. Vor Wochen hast du in Kathmandu noch kein Wort verstanden. Heute hast du die Basis – und ein Land voll im Herzen.",
      reveal: { q: "Wie heißt dieses Land auf Nepali?", a: "नेपाल (Nepaal)" },
      items: ["l17_04"],
      warmups: ["l1_06", "l12_07"],
      endBonus: "Du hast die Basis gemeistert – धन्यवाद, नेपाल!",
      choice: {
        q: "Ein letzter Blick auf die Berge. Was flüsterst du?",
        options: [
          { ne: "धन्यवाद, नेपाल!", tr: "dhanyabaad, Nepaal!", correct: true, why: "Danke, Nepal – für alles. Die Reise ist komplett." },
          { ne: "फेरि भेटौंला", tr: "pheri bhetaunlaa", correct: false, why: "„Auf Wiedersehen“ – fast perfekt, aber der Moment will den Dank." },
          { ne: "सुन्दर!", tr: "sundar!", correct: false, why: "Wunderschön ist es – aber dieses letzte Wort gehört dem Dank." }
        ]
      }
    }
  ]
};


// Gamification-Inhalte v2: Reise, Buchstaben, Höflichkeit, Story, Challenges, Grammatik-Tipps
window.JOURNEY = {
  stops: [
    { id: "kathmandu", name: "Kathmandu", sub: "Ankunft in Nepal", xp: 0 },
    { id: "thamel", name: "Thamel", sub: "Deine Basis im Getümmel", xp: 30 },
    { id: "swayambhu", name: "Swayambhu", sub: "Der Affentempel", xp: 90 },
    { id: "bhaktapur", name: "Bhaktapur", sub: "Die rote Stadt", xp: 170 },
    { id: "nagarkot", name: "Nagarkot", sub: "Sonnenaufgang überm Himalaya", xp: 270 },
    { id: "pokhara", name: "Pokhara", sub: "Am Phewa-See", xp: 400 },
    { id: "lumbini", name: "Lumbini", sub: "Geburtsort Buddhas", xp: 560 },
    { id: "chitwan", name: "Chitwan", sub: "Im Dschungel", xp: 750 },
    { id: "everest", name: "Everest Base Camp", sub: "Das Dach der Welt", xp: 1000 }
  ]
};

// Devanagari-Buchstaben: id, Zeichen, Laut, Eselsbrücke, Beispielwort (optional)
window.LETTERS = [
  { id: "let_01", ch: "अ", sound: "a", hint: "Ein Hocker mit Fahne – der Grundvokal, aus dem alle anderen entstehen" },
  { id: "let_02", ch: "क", sound: "ka", hint: "Ein Kamm an einer Stange – wie ein ,k' mit Zähnen", word: "कस्तो" },
  { id: "let_03", ch: "ग", sound: "ga", hint: "Eine 3 mit Schlinge – weich wie ,g' in ,gut'", word: "गर्नुहोस्" },
  { id: "let_04", ch: "च", sound: "cha", hint: "Ein ,y' mit verknotetem Bein", word: "छु" },
  { id: "let_05", ch: "ज", sound: "ja", hint: "Eine 8 mit Schnur überm Kopf – wie ,j' in ,Jahr'", word: "जर्मनबाट" },
  { id: "let_06", ch: "त", sound: "ta", hint: "Eine 3 mit Kappe und Bein – weiches ,t' wie in ,Wasser'", word: "तपाईं" },
  { id: "let_07", ch: "द", sound: "da", hint: "Eine 6 mit zwei Wimpern – weiches ,d' wie in ,Paderborn'" },
  { id: "let_08", ch: "न", sound: "na", hint: "Ein ,n' unter der Wäscheleine – die Oberlinie gilt für alle Buchstaben", word: "नमस्ते" },
  { id: "let_09", ch: "म", sound: "ma", hint: "Ein ,u' mit Krone und Zipfel – wie in ,ममा'… äh, माया (Liebe)", word: "माया" },
  { id: "let_10", ch: "र", sound: "ra", hint: "Eine tanzende 2 mit Peitsche – rollendes ,r' willkommen", word: "राम्रो" },
  { id: "let_11", ch: "ल", sound: "la", hint: "Ein Löffel mit Anlauf", word: "लाई" },
  { id: "let_12", ch: "स", sound: "sa", hint: "Eine 8 mit Schnürsenkel", word: "स्वागत" }
];

// Höflichkeits-Detektiv: Nepali kennt drei „du"-Stufen
window.DETECTIVE = {
  intro: {
    title: "Drei Stufen von „du“",
    body: "Nepali unterscheidet, WEN du ansprichst – mit drei verschiedenen „du“:",
    levels: [
      { ne: "तँ", tr: "ta", de: "ganz niedrig – kleine Kinder, sehr Intimes; für Fremde eine Beleidigung!" },
      { ne: "तिमी", tr: "timi", de: "locker – Freunde, Familie, Gleichaltrige" },
      { ne: "तपाईं", tr: "tapaai", de: "respektvoll – Fremde, Ältere, Amtspersonen, Kunden" }
    ]
  },
  scenes: [
    { id: "det_1", who: "Ein buddhistischer Mönch im Kloster", answer: "tapaai" },
    { id: "det_2", who: "Dein bester Freund aus Kathmandu", answer: "timi" },
    { id: "det_3", who: "Der 5-jährige Sohn deiner Gastfamilie", answer: "ta" },
    { id: "det_4", who: "Ein Polizist, der deinen Pass prüft", answer: "tapaai" },
    { id: "det_5", who: "Dein Zimmergenosse im Hostel, 24 Jahre", answer: "timi" },
    { id: "det_6", who: "Die Inhaberin des Teeladens", answer: "tapaai" }
  ]
};

// Story 1: Taxi nach Thamel – Schritt für Schritt, mit Auswahl
window.STORY1 = {
  id: "st1",
  title: "Taxi nach Thamel",
  place: "Kathmandu · Flughafen",
  steps: [
    { type: "narr", de: "Du bist gerade in Kathmandu gelandet. Dein Rucksack ist schwer, und dein Hostel liegt in Thamel. Vor dir hält ein Taxi. Der Fahrer grinst und fragt:",
      reveal: { q: "Wo liegt dein Hostel?", a: "In Thamel (थमेल)" } },
    { type: "line", who: "Taxi-Fahrer", ne: "नमस्ते! कहाँ जानुहोस्?", tr: "namaste! kahaan jaanuhos?", de: "Namaste! Wohin gehen Sie?", audio: "st1_01",
      note: "कहाँ (kahaan) = wo · जानुहोस् (jaanuhos) = gehen Sie" },
    { type: "choice", de: "Wohin willst du? Antworte dem Fahrer:",
      options: [
        { ne: "मलाई थमेल जानुपर्छ।", tr: "malaai Thamel jaanuparchha.", de: "Ich muss nach Thamel.", correct: true, audio: "st1_02" },
        { ne: "मेरो नाम माया हो।", tr: "mero naam Maaya ho.", de: "Mein Name ist Maya.", correct: false,
          why: "Nett, aber der Fahrer will dein Ziel wissen, nicht deinen Namen. मलाई … जानुपर्छ = „Ich muss nach …“" }
      ] },
    { type: "line", who: "Taxi-Fahrer", ne: "ठीक छ, आउनुहोस्।", tr: "thik chha, aaunuhos.", de: "In Ordnung, steigen Sie ein.", audio: "st1_03" },
    { type: "narr", de: "Die Fahrt rumpelt über Schlaglöcher, Räder hupen, ein Hund weicht aus. In Thamel hält das Taxi. Du willst den Preis wissen – welche Frage stellst du?",
      reveal: { q: "Wie heißt nochmal „wie viel“?", a: "कति (kati)" } },
    { type: "choice", de: "Frage nach dem Preis:",
      options: [
        { ne: "यो कति हो?", tr: "yo kati ho?", de: "Was kostet das?", correct: true, audio: "st1_04" },
        { ne: "यो कहाँ हो?", tr: "yo kahaan ho?", de: "Wo ist das?", correct: false,
          why: "Fast! कहाँ = „wo“ – du brauchst aber कति = „wie viel“. Merk dir: कति mit dem i-Ende wie „Kost-et was?“" }
      ] },
    { type: "line", who: "Taxi-Fahrer", ne: "पचास रुपैयाँ।", tr: "pachaas rupaiyaa.", de: "Fünfzig Rupien.", audio: "st1_05" },
    { type: "narr", de: "Du zahlst, steigst aus. Beim Abschied bedankst du dich – und der Fahrer ruft dir hinterher:",
      reveal: { q: "Wie verabschiedet man sich auf Nepali?", a: "फेरि भेटौंला (pheri bhetaunlaa) – „bis wir uns wiedersehen“" } },
    { type: "line", who: "Taxi-Fahrer", ne: "फेरि भेटौंला, धन्यवाद!", tr: "pheri bhetaunlaa, dhanyabaad!", de: "Auf Wiedersehen – danke!", audio: "st1_06" },
    { type: "end", de: "Angekommen in Thamel! Du hast gerade deinen ersten echten Dialog auf Nepali überstanden.", bonus: "Culture: beim Bezlegen des Preises ist Handeln normal – lächeln und „अलि कम गर्नुहोस्“ (etwas weniger, bitte) bringt dich weit." }
  ]
};

// Tägliche Challenges (eine pro Tag, Bonus-XP) – Devanagari immer mit Umschrift, damit A0 lesbar bleibt
window.CHALLENGES = [
  { id: "ch1", de: "Schreib नमस्ते (namaste) auf einen Zettel und kleb ihn an deinen Spiegel.",
    gloss: "नमस्ते (namaste) = Hallo / Grüß dich – wörtlich: „ich verneige mich vor dir“." },
  { id: "ch2", de: "Such auf YouTube ein nepalesisches Lied und lausch, ob du माया (maaya – Liebe) heraushörst.",
    gloss: "माया (maaya) = Liebe – kommt in fast jedem nepalesischen Lied vor." },
  { id: "ch3", de: "Zähl heute fünf Dinge in deiner Wohnung auf Nepali: ek, dui, tin, chaar, paanch (एक दुई तीन चार पाँच).",
    gloss: "एक (ek) = 1 · दुई (dui) = 2 · तीन (tin) = 3 · चार (chaar) = 4 · पाँच (paanch) = 5" },
  { id: "ch4", de: "Schreib deinen Namen in Devanagari – Frag mich, wenn du Hilfe brauchst: die Silben bauen sich aus den Buchstaben der Lektion auf.",
    gloss: "Devanagari = die Schrift des Nepali. Jede Silbe ist ein Zeichen – die ersten 12 zeigt die Session „Devanagari enträtseln“." },
  { id: "ch5", de: "Sag heute zu einem Menschen „namaste“ – mit gefalteten Händen, नमस्ते-Style.",
    gloss: "नमस्ते (namaste) = der nepalesische Gruß. Die Geste mit gefalteten Händen heißt „namaskar“." },
  { id: "ch6", de: "Üb das nepalesische Kopf-Wackeln: Kopf seitlich rollen bedeutet „alles klar“ – mach es dreimal, jetzt.",
    gloss: "Das seitliche Kopf-Rollen heißt so viel wie „ja / alles klar / okay“ – es ist Nicks, Wackeln und Achselzucken in einem." },
  { id: "ch7", de: "Trink heute deinen Tee wie in Nepal: mit Milch und Zucker (chiya – चिया) und sag vorher zufrieden „thik chha!“.",
    gloss: "चिया (chiya) = Tee mit Milch und Zucker · ठीक छ (thik chha) = „alles klar / gut“." },
  { id: "ch8", de: "Erinnere dich an drei Wörter aus der letzten Session, ohne in die App zu schauen – dann prüf nach.",
    gloss: "Tipp: Sag die Wörter laut aus – was du aussprichst, bleibt viel besser hängen." }
];
// Grammatik im Sprachvergleich (Deutsch ↔ Nepali)
window.GRAMMAR_TIPS = [
  { id: "gt1", title: "Das Verb wandert ans Ende",
    de: "Deutsch: Ich bin okay → Subjekt-Verb-Rest. Nepali: म ठीक छु (ma thik chhu) = „Ich okay bin“ – Subjekt-Rest-Verb. Das Verb छु (bin) steht ganz hinten.",
    ne: "म ठीक छु।", tr: "ma thik chhu." },
  { id: "gt2", title: "Kein der/die/das",
    de: "Nepali hat keine Artikel. किताब heißt einfach „Buch“ – die Wäscheleine oben zeigt nur, dass es ein Wort ist, nicht sein Geschlecht.",
    ne: "किताब", tr: "kitaab" },
  { id: "gt3", title: "Präpositionen hängen hinten dran",
    de: "Deutsch: AUS Deutschland. Nepali: जर्मनबाट = जर्मन (Deutschland) + बाट (aus). Aus Präposition wird Nachsilbe – wie lateinisch „ex“ als Anhängsel.",
    ne: "म जर्मनबाट आएको हुँ।", tr: "ma Jarmanbaata aeko hun." },
  { id: "gt4", title: "Höflichkeit steckt im Verb",
    de: "Deutsch macht „Sie“ mit Pronomen. Nepali baut die Höflichkeit ins Verbende: जानुहोस् (gehen Sie) vs. जा (geh!). Ein Satz, zwei Welten.",
    ne: "बिस्तारै बोल्नुहोस्", tr: "bistaarai bolnuhos" }
];
