// Kapitel 1 – Ankunft in Kathmandu: die Geschichte der ersten Reise-Etappe.
// Szene 4 (Taxi) laeuft auf STORY1 weiter (steps werden in der Session verbunden).
// Sprachfelder: title/titleEn, intro/introEn, reveal q/qEn a/aEn, choice q/qEn, option why/whyEn.
window.CHAPTER1 = {
  id: "chap1",
  title: "Ankunft in Kathmandu",
  titleEn: "Arrival in Kathmandu",
  scenes: [
    {
      id: "c1s1", title: "Landung", titleEn: "Landing", art: "airport", xpBonus: 15,
      intro: "Nach zehn Stunden Flug setzt das Flugzeug endlich auf – Willkommen in Kathmandu! Im Terminal drängeln sich Menschen, Lautsprecher rappeln auf Nepali. Erstmal durchatmen: नमस्ते!",
      introEn: "After ten hours in the air the plane finally touches down – welcome to Kathmandu! The terminal is crowded, loudspeakers rattle on in Nepali. Take a breath: नमस्ते!",
      reveal: { q: "Wie heißt nochmal der Flughafen auf Nepali?", qEn: "What's the Nepali word for airport again?", a: "विमानस्थल (bimaanasthal)" },
      items: ["l9_01", "l9_02", "l9_03"],
      warmups: ["l1_01", "l1_11"],
      choice: {
        q: "Du willst raus aus dem Terminal. Was fragst du?",
        qEn: "You want out of the terminal. What do you ask?",
        options: [
          { ne: "निस्कने ढोका कहाँ हो?", tr: "niskane dhaakaa kaha ho?", correct: true, why: "Genau – „Wo ist der Ausgang?“ bring dich nach draußen.", whyEn: "Exactly – “Where is the exit?” gets you outside." },
          { ne: "कति बजे?", tr: "kati baje?", why: "„Wie spät ist es?“ hilft dir später – erst mal raus hier!", whyEn: "“What time is it?” helps later – first get out of here!", correct: false },
          { ne: "नमस्ते", tr: "namaste", why: "Freundlich! aber der Ausgang ist trotzdem noch nicht gefunden.", whyEn: "Friendly! But you still haven't found the exit." }
        ]
      }
    },
    {
      id: "c1s2", title: "Geld wechseln", titleEn: "Exchanging Money", art: "money", xpBonus: 15,
      intro: "Vor dem Terminal wartet der Geldwechsler-Schalter. Aus Euro werden Rupien – und plötzlich bist du Millionär. Zumindest auf dem Papier.",
      introEn: "The money-changer counter waits outside the terminal. Euros become rupees – and suddenly you're a millionaire. On paper, at least.",
      reveal: { q: "Wie heißt die nepalesische Währung?", qEn: "What is Nepal's currency called?", a: "रुपैयाँ (rupaiya)" },
      items: ["l9_04", "l9_05", "l2_01", "l2_02"],
      warmups: ["l1_01", "l1_11"],
      choice: {
        q: "Am Schalter fragst du nach dem Wechselplatz. Was sagst du?",
        qEn: "At the counter you ask for the exchange place. What do you say?",
        options: [
          { ne: "पैसा फेर्ने ठाउँ कहाँ छ?", tr: "paisa pherne thau kaha chha?", correct: true, why: "Richtig – so findest du den Schalter.", whyEn: "Right – that's how you find the counter." },
          { ne: "एक, दुई, तीन", tr: "ek, dui, tin", why: "Die Zahlen brauchst du gleich zum Zählen – aber die Frage war eine andere.", whyEn: "You'll need the numbers for counting – but that wasn't the question.", correct: false },
          { ne: "मीठो!", tr: "mitho!", why: "„Lecker!“ – hoffentlich nicht zur Rupie gesagt.", whyEn: "“Delicious!” – hopefully not said to a banknote." }
        ]
      }
    },
    {
      id: "c1s3", title: "Der Weg zum Taxi", titleEn: "Finding the Taxi", art: "directions", xpBonus: 15,
      intro: "Mit frischen Rupien in der Tasche geht es raus. Irgendwo hier muss der Taxi-Stand sein – links? Rechts? Geradeaus? Zeit für die ersten Richtungen.",
      introEn: "Fresh rupees in your pocket, you head out. Somewhere around here must be the taxi stand – left? Right? Straight ahead? Time for your first directions.",
      reveal: { q: "Wie fragst du nach einem Taxi?", qEn: "How do you ask for a taxi?", a: "ट्याक्सी कहाँ छ? (tyaksi kaha chha?)" },
      items: ["l9_06", "l4_05", "l4_06", "l4_07"],
      warmups: ["l9_03", "l9_02"],
      choice: {
        q: "Ein freundlicher Mann zeigt dir den Weg. Er sagt „दायाँ“ – wo gehst du hin?",
        qEn: "A friendly man shows you the way. He says “दायाँ” – where do you go?",
        options: [
          { ne: "दायाँ", tr: "daayaa", correct: true, why: "दायाँ = rechts. Du bist auf dem richtigen Weg.", whyEn: "दायाँ = right. You're on the right track." },
          { ne: "बायाँ", tr: "baayaa", why: "Links wäre बायाँ – der Mann meinte aber rechts.", whyEn: "Left would be बायाँ – but the man meant right.", correct: false },
          { ne: "सिधा", tr: "sidha", why: "Geradeaus ist सिधा – das kam nicht vor.", whyEn: "Straight is सिधा – that wasn't what he said." }
        ]
      }
    },
    {
      id: "c1s4", title: "Hotel-Check-in", titleEn: "Hotel Check-in", art: "hotel", xpBonus: 20,
      intro: "Erste Nacht in Kathmandu: Hinter der Hotel-Rezeption wartet die letzte Aufgabe des Tages – einchecken, auf Nepali.",
      introEn: "First night in Kathmandu: behind the hotel desk waits the day's last task – checking in, in Nepali.",
      reveal: { q: "Wie sagst du, dass du ein Zimmer brauchst?", qEn: "How do you say you need a room?", a: "एउटा कोठा चाहियो। (eutaa kotha chahiyo.)" },
      items: ["l9_08", "l9_09", "l9_10", "l9_11"],
      warmups: ["l1_13", "l1_15"],
      choice: {
        q: "An der Rezeption sagst du, dass du reserviert hast. Was sagst du?",
        qEn: "At the desk you say you have a reservation. What do you say?",
        options: [
          { ne: "बुक गरेको छु।", tr: "buk gareko chhu.", correct: true, why: "Perfekt – „Ich habe reserviert“, und der Schlüssel ist dein.", whyEn: "Perfect – “I have a reservation”, and the key is yours." },
          { ne: "एउटा कोठा चाहियो।", tr: "eutaa kotha chahiyo.", correct: false, why: "Auch gut – aber die Frage war, ob du reserviert HAST.", whyEn: "Also good – but the question was whether you HAVE a reservation." },
          { ne: "म डाक्टर चाहियो।", tr: "ma doctor chahiyo.", correct: false, why: "Hoffentlich nicht nötig nach dem ersten Tag!", whyEn: "Hopefully not needed after day one!" }
        ]
      }
    },
    {
      id: "c1s5", title: "Im Taxi nach Thamel", titleEn: "In the Taxi to Thamel", art: "taxi", xpBonus: 25, useStory1: true,
      intro: "Ausgeruht geht es am Morgen weiter: rein ins Taxi, Ziel Thamel – deine Basis für die nächsten Tage. Sag dem Fahrer, wo es hingeht – und wo du herkommst.",
      introEn: "Rested, the journey continues in the morning: into the taxi, destination Thamel – your base for the coming days. Tell the driver where you're going – and where you're from.",
      items: ["l9_07", "l8_11"],
      warmups: ["l1_15", "l9_06"]
    }
  ]
};

// Kapitel 2 – Thamel: Deine Basis im Getümmel
window.CHAPTER2 = {
  id: "chap2", title: "Thamel – deine Basis", titleEn: "Thamel – your base",
  scenes: [
    {
      id: "c2s1", title: "Erstes Frühstück", titleEn: "First Breakfast", art: "cafe", xpBonus: 15,
      intro: "Erster Morgen in Thamel. Überall riecht es nach Tee und Zimt – Zeit fürs erste Frühstück auf Nepali.",
      introEn: "First morning in Thamel. The air smells of tea and cinnamon – time for your first breakfast in Nepali.",
      reveal: { q: "Wie bestellst du einen Tee?", qEn: "How do you order a tea?", a: "चिया दिनुहोस्। (chiya dinuhos.)" },
      items: ["l10_01", "l10_02", "l10_03"],
      warmups: ["l1_01", "l9_03"],
      choice: {
        q: "Der Kellner fragt, was du magst. Was sagst du?",
        qEn: "The waiter asks what you'd like. What do you say?",
        options: [
          { ne: "चिया दिनुहोस्।", tr: "chiya dinuhos.", correct: true, why: "Perfekt – Tee, bitte. Das Bestell-Muster für alles.", whyEn: "Perfect – tea, please. The ordering pattern for everything." },
          { ne: "बिल दिनुहोस्।", tr: "bila dinuhos.", correct: false, why: "Die Rechnung kommt zum Schluss – erst genießen!", whyEn: "The bill comes at the end – enjoy first!" },
          { ne: "नमस्ते", tr: "namaste", correct: false, why: "Freundlich begrüßt hast du schon – jetzt gehts ums Bestellen.", whyEn: "You've already said hello – now it's about ordering." }
        ]
      }
    },
    {
      id: "c2s2", title: "Auf dem Basar", titleEn: "At the Bazaar", art: "bazar", xpBonus: 15,
      intro: "Der Basar von Thamel: Gewürze, Decken, Klingelnde Radläufe. Hier lernst du das wichtigste Wort jedes Markts – und wie man feilscht.",
      introEn: "The Thamel bazaar: spices, blankets, ringing bicycle bells. Here you learn the most important word of any market – and how to haggle.",
      reveal: { q: "Was heißt बजार?", qEn: "What does बजार mean?", a: "bajaar = Basar, Markt", aEn: "bajaar = bazaar, market" },
      items: ["l10_06", "l8_02", "l8_03"],
      warmups: ["l2_01", "l2_02", "l2_11"],
      choice: {
        q: "Der Händler nennt einen Preis, der ist zu hoch. Was sagst du?",
        qEn: "The vendor names a price that's too high. What do you say?",
        options: [
          { ne: "एकदम महँगो भयो!", tr: "ekdam mahango bhayo!", correct: true, why: "„Viel zu teuer!“ – so beginnt jede Verhandlung in Nepal.", whyEn: "“Way too expensive!” – that's how every negotiation in Nepal begins." },
          { ne: "मीठो छ!", tr: "mitho chha!", correct: false, why: "„Lecker!“ passt zum Essen, nicht zum Preis.", whyEn: "“Delicious!” is for food, not for prices." },
          { ne: "यो कति पर्छ?", tr: "yo kati parchha?", correct: false, why: "Gute Frage – aber den Preis kennst du ja schon, er ist zu hoch!", whyEn: "Good question – but you already know the price, and it's too high!" }
        ]
      }
    },
    {
      id: "c2s3", title: "Wegbeschreibung", titleEn: "Asking Directions", art: "directions", xpBonus: 15,
      intro: "Verlaufen im Gassengewirr? Keine Panik – du hast ja deine Richtungs-Wörter dabei. Heute ohne neue Wörter: nur du und der Weg.",
      introEn: "Lost in the maze of alleys? No panic – you have your direction words with you. No new words today: just you and the way.",
      reveal: { q: "Was heißt सिधा?", qEn: "What does सिधा mean?", a: "sidha = geradeaus", aEn: "sidha = straight ahead" },
      items: [],
      warmups: ["l4_05", "l4_06", "l4_07", "l9_06"],
      choice: {
        q: "Du fragst nach dem Café. Jemand sagt: „सिधा जानुहोस्।“ – was tust du?",
        qEn: "You ask for the café. Someone says: “सिधा जानुहोस्।” – what do you do?",
        options: [
          { ne: "सिधा जानुहोस्", tr: "sidha jaanuhos", correct: true, why: "Genau – geradeaus gehen. Du kennst beide Wörter schon!", whyEn: "Exactly – go straight. You already know both words!" },
          { ne: "दायाँ जानुहोस्", tr: "daayaa jaanuhos", correct: false, why: "दायाँ wäre rechts – gesagt wurde सिधा, geradeaus.", whyEn: "दायाँ would be right – but they said सिधा, straight." },
          { ne: "बायाँ जानुहोस्", tr: "baayaa jaanuhos", correct: false, why: "बायाँ wäre links – gesagt wurde सिधा.", whyEn: "बायाँ would be left – but they said सिधा." }
        ]
      }
    },
    {
      id: "c2s4", title: "Abend in Thamel", titleEn: "Evening in Thamel", art: "cafe", xpBonus: 20,
      intro: "Der Tag klingt aus, Laterne an, noch einmal zum Essen. Danach weißt du: Thamel ist deine Basis – hier kommst du immer zurück.",
      introEn: "The day winds down, lanterns on, one more meal out. Afterwards you know: Thamel is your base – you'll keep coming back here.",
      reveal: { q: "Wie bestellst du die Rechnung?", qEn: "How do you ask for the bill?", a: "बिल दिनुहोस्। (bila dinuhos.)" },
      items: ["l10_04", "l10_05", "l10_07"],
      warmups: ["l10_01", "l8_02"],
      choice: {
        q: "Beim Bezahlen grinst der Kellner: „Sie sprechen schon Nepali!“ Was antwortest du?",
        qEn: "Paying up, the waiter grins: “You already speak Nepali!” What do you answer?",
        options: [
          { ne: "म यहाँ बस्छु।", tr: "ma yahaa baschhu.", correct: true, why: "„Ich wohne hier“ – in Thamel gehörst du jetzt ein bisschen dazu.", whyEn: "“I live here” – in Thamel you now kind of belong." },
          { ne: "पैसा दिनुहोस्।", tr: "paisa dinuhos.", correct: false, why: "„Geld, bitte!“ – höflich ist was anderes beim Bezahlen.", whyEn: "“Money, please!” – that's not quite polite when paying." },
          { ne: "बजार", tr: "bajaar", correct: false, why: "Der Basar schläft schon – und ein Wort ist kein Satz.", whyEn: "The bazaar is asleep – and one word is not a sentence." }
        ]
      }
    }
  ]
};

// Kapitel 3 – Swayambhu: Der Affentempel
window.CHAPTER3 = {
  id: "chap3", title: "Swayambhu – der Affentempel", titleEn: "Swayambhu – the Monkey Temple",
  scenes: [
    {
      id: "c3s1", title: "Der Aufstieg", titleEn: "The Climb", art: "stupa", xpBonus: 15,
      intro: "Ein Berg aus Stein und Stufen, oben die Augen des Buddha, überall Affen. Swayambhu ruft – du steigst hinauf.",
      introEn: "A mountain of stone and steps, the eyes of Buddha at the top, monkeys everywhere. Swayambhu is calling – you climb up.",
      reveal: { q: "Was heißt मन्दिर?", qEn: "What does मन्दिर mean?", a: "mandir = Tempel", aEn: "mandir = temple" },
      items: ["l11_07", "l11_01", "l11_02"],
      warmups: ["l10_01", "l9_07"],
      choice: {
        q: "Halbwegs ruhen dich die Stein-Stufen aus. Ein Affe schaut dich an. Was ist das?",
        qEn: "Halfway up, the stone steps give you a rest. A monkey looks at you. What is it?",
        options: [
          { ne: "बानर", tr: "baanar", correct: true, why: "Ein Affe! Swayambhu ist voll von ihnen – freundlich, aber knackig.", whyEn: "A monkey! Swayambhu is full of them – friendly but feisty." },
          { ne: "मन्दिर", tr: "mandir", correct: false, why: "Das Tempel-Dach kommt erst oben – das hier ist ein Affe.", whyEn: "The temple roof comes at the top – this is a monkey." },
          { ne: "ढुङ्गा", tr: "dhunga", correct: false, why: "Aus Stein sind die Stufen – das Tier darauf heißt anders.", whyEn: "The steps are made of stone – the animal on them has another name." }
        ]
      }
    },
    {
      id: "c3s2", title: "Gebetsmühlen & Fahnen", titleEn: "Prayer Wheels & Flags", art: "stupa", xpBonus: 15,
      intro: "Oben drehst du die Gebetsmühlen, im Wind flattern die bunten Fahnen. Alles hier ist langsam und ruhig – शान्त.",
      introEn: "At the top you spin the prayer wheels, colorful flags flutter in the wind. Everything here is slow and calm – शान्त.",
      reveal: { q: "Was heißt शान्त?", qEn: "What does शान्त mean?", a: "shaanta = ruhig", aEn: "shaanta = calm, peaceful" },
      items: ["l11_05", "l11_04"],
      warmups: ["l1_08", "l1_05"],
      choice: {
        q: "Ein Mönch nickt dir zu. Du willst respektvoll wirken. Welches Wort passt zu diesem Ort?",
        qEn: "A monk nods at you. You want to seem respectful. Which word fits this place?",
        options: [
          { ne: "शान्त", tr: "shaanta", correct: true, why: "Ruhe – genau das Gefühl hier oben.", whyEn: "Calm – exactly the feeling up here." },
          { ne: "गरम", tr: "garam", correct: false, why: "„Heiß“ – eher der Tee unten am Berg, nicht die Stimmung.", whyEn: "“Hot” – that's the tea at the bottom, not the mood." },
          { ne: "मीठो", tr: "mitho", correct: false, why: "„Lecker“ – für Essen, nicht für Tempel-Ruhe.", whyEn: "“Delicious” – for food, not for temple calm." }
        ]
      }
    },
    {
      id: "c3s3", title: "Blick über die Stadt", titleEn: "View over the City", art: "sunset", xpBonus: 20,
      intro: "Von der Plattform siehst du die ganze Stadt im Dunst liegen. Irgendwo da unten ist dein Zimmer – und morgen geht die Reise weiter.",
      introEn: "From the platform you see the whole city shimmer in the haze. Somewhere down there is your room – and tomorrow the journey continues.",
      reveal: { q: "Wie heißt die Stadt auf Nepali?", qEn: "What is the Nepali word for city?", a: "शहर (shahar)" },
      items: ["l11_03", "l11_06"],
      warmups: ["l11_01", "l10_05"],
      choice: {
        q: "Ein Reisender will den Blick auch sehen. Was sagst du ihm?",
        qEn: "A traveler wants to see the view too. What do you tell them?",
        options: [
          { ne: "देख्नुहोस्!", tr: "dekhnuhos!", correct: true, why: "„Schauen Sie!“ – die höfliche Form, wie bei जानुहोस्.", whyEn: "“Look!” – the polite form, like जानुहोस्." },
          { ne: "बानर!", tr: "baanar!", correct: false, why: "Achtung, Affe! – aber der Blick war die Antwort.", whyEn: "Watch out, monkey! – but the view was the answer." },
          { ne: "शहर", tr: "shahar", correct: false, why: "Richtiges Wort, aber als Ausruf fehlt der Gruß drumherum.", whyEn: "Right word, but as an exclamation it needs a verb around it." }
        ]
      }
    }
  ]
};

// Kapitel 4 – Bhaktapur: Die rote Stadt
window.CHAPTER4 = {
  id: "chap4", title: "Bhaktapur – die rote Stadt", titleEn: "Bhaktapur – the red city",
  scenes: [
    {
      id: "c4s1", title: "Ankunft in der Altstadt", titleEn: "Arrival in the Old Town", art: "oldtown", xpBonus: 15,
      intro: "Der Bus setzt dich vor einem riesigen alten Tor ab. Rote Ziegel, engen Gassen, Zeit aus einem anderen Jahrhundert.",
      introEn: "The bus drops you in front of a huge old gate. Red bricks, narrow alleys, a time from another century.",
      reveal: { q: "Was heißt ढोका?", qEn: "What does ढोका mean?", a: "dhaakaa = Tor", aEn: "dhaakaa = gate" },
      items: ["l12_01", "l12_02", "l12_03"],
      warmups: ["l11_03", "l10_06"],
      choice: {
        q: "Du gehst durch das alte Tor. Was war das gerade?",
        qEn: "You walk through the old gate. What was that?",
        options: [
          { ne: "ढोका", tr: "dhaakaa", correct: true, why: "Das Tor – wie im „Ausgang“ vom Flughafen, nur größer.", whyEn: "The gate – like the airport “exit”, only bigger." },
          { ne: "गाउँ", tr: "gaaun", correct: false, why: "Das Städtchen liegt dahinter – das Tor ist die Tür zu ihm.", whyEn: "The town lies behind it – the gate is its door." },
          { ne: "शहर", tr: "shahar", correct: false, why: "Die große Stadt war Kathmandu – hier steht das Dorf-Wort bereit.", whyEn: "The big city was Kathmandu – here the village word fits." }
        ]
      }
    },
    {
      id: "c4s2", title: "Der Töpfermeister", titleEn: "The Potter", art: "oldtown", xpBonus: 15,
      intro: "In einer Gasse dreht sich die Töpferscheibe. Aus roter Erde werden Schalen, Tassen, Elefanten. Der Meister zeigt es dir – ganz langsam.",
      introEn: "In an alley a potter's wheel spins. From red clay come bowls, cups, elephants. The master shows you how – very slowly.",
      reveal: { q: "Was heißt माटो?", qEn: "What does माटो mean?", a: "maato = Ton, Erde", aEn: "maato = clay, earth" },
      items: ["l12_04"],
      warmups: ["l12_03", "l11_07"],
      choice: {
        q: "Der Meister fragt, ob die Schüssel aus Ton gut geworden ist. Was sagst du ehrlich?",
        qEn: "The master asks whether the clay bowl turned out well. What do you honestly say?",
        options: [
          { ne: "राम्रो!", tr: "raamro!", correct: true, why: "„Schön!“ – das alte Bekannte aus Lektion 1, hier Gold wert.", whyEn: "“Nice!” – the old friend from lesson 1, worth gold here." },
          { ne: "पुरानो", tr: "puraano", correct: false, why: "„Alt“ ist die Stadt – die frische Schüssel ist raamro.", whyEn: "“Old” is the city – the fresh bowl is raamro." },
          { ne: "खुशी", tr: "khushi", correct: false, why: "Fast – Freude fühlst du, aber das Lob heißt raamro.", whyEn: "Close – joy is what you feel, but the praise is raamro." }
        ]
      }
    },
    {
      id: "c4s3", title: "Abschied vom Tal", titleEn: "Farewell to the Valley", art: "sunset", xpBonus: 20,
      intro: "Abendlicht über den Dächern, morgen früh geht es weiter ins Gebirge. Ein letzter chai, ein letzter Blick – dann: Nagarkot.",
      introEn: "Evening light over the rooftops; tomorrow morning you head into the mountains. One last chai, one last look – then: Nagarkot.",
      reveal: { q: "Was heißt बिहान?", qEn: "What does बिहान mean?", a: "bihana = Morgen", aEn: "bihana = morning" },
      items: ["l12_05", "l12_06", "l12_07"],
      warmups: ["l1_05", "l11_04"],
      choice: {
        q: "Wie fühlst du dich beim Abschied vom Kathmandu-Tal?",
        qEn: "How do you feel saying goodbye to the Kathmandu Valley?",
        options: [
          { ne: "खुशी", tr: "khushi", correct: true, why: "Freude – du hast geschafft, was vor zwei Tagen undenkbar war.", whyEn: "Joy – you've done what was unthinkable two days ago." },
          { ne: "बेलुका", tr: "beluka", correct: false, why: "Der Abend ist die Zeit, nicht das Gefühl.", whyEn: "Evening is the time, not the feeling." },
          { ne: "शान्त", tr: "shaanta", correct: false, why: "Ruhig war der Tempel – jetzt ist Freudengefühl angesagt.", whyEn: "Calm was the temple – right now joy is the word." }
        ]
      }
    }
  ]
};


// Kapitel 5 – Nagarkot: Sonnenaufgang
window.CHAPTER5 = {
  id: "chap5", title: "Nagarkot – Sonnenaufgang", titleEn: "Nagarkot – sunrise",
  scenes: [
    {
      id: "c5s1", title: "Der frühe Bus", titleEn: "The Early Bus", art: "sunrise", xpBonus: 15,
      intro: "Vier Uhr morgens. Wer den Sonnenaufgang überm Himalaya sehen will, muss schnell sein – छिटो!",
      introEn: "Four in the morning. Whoever wants to see the sunrise over the Himalaya has to be quick – छिटो!",
      reveal: { q: "Was heißt छिटो?", qEn: "What does छिटो mean?", a: "chhito = schnell", aEn: "chhito = fast, quick" },
      items: ["l13_01", "l13_02"],
      warmups: ["l4_01", "l12_05"],
      choice: {
        q: "Der Busfahrer wartet nicht lange. Was ruft er?",
        qEn: "The bus driver won't wait long. What does he shout?",
        options: [
          { ne: "छिटो! छिटो!", tr: "chhito! chhito!", correct: true, why: "„Schnell, schnell!“ – der häufigste Ruf Nepals am frühen Morgen.", whyEn: "“Quick, quick!” – Nepal's most common early-morning call." },
          { ne: "ढिलो", tr: "dhilo", correct: false, why: "„Langsam“ – damit verpasst du den Sonnenaufgang garantiert.", whyEn: "“Slow” – that's a guaranteed way to miss the sunrise." },
          { ne: "बिहान", tr: "bihana", correct: false, why: "Der Morgen ist schon da – jetzt zählt die Geschwindigkeit.", whyEn: "Morning is already here – now speed is what counts." }
        ]
      }
    },
    {
      id: "c5s2", title: "Warten auf das Licht", titleEn: "Waiting for the Light", art: "sunrise", xpBonus: 15,
      intro: "Oben auf dem Hügel: Kälte, Tee aus Thermoskannen, und alle Blicke gehen in denselben Himmel.",
      introEn: "On top of the hill: cold, tea from thermoses, and every gaze aimed at the same sky.",
      reveal: { q: "Was heißt आकाश?", qEn: "What does आकाश mean?", a: "aakaash = Himmel", aEn: "aakaash = sky" },
      items: ["l13_03", "l13_04"],
      warmups: ["l5_06", "l5_01"],
      choice: {
        q: "Vor dir zieht eine Wolke vorbei. Was ist das?",
        qEn: "A cloud drifts past in front of you. What is it?",
        options: [
          { ne: "बादल", tr: "baadal", correct: true, why: "Eine Wolke – hoffentlich zieht sie weiter, bevor die Sonne kommt.", whyEn: "A cloud – hopefully it moves on before the sun arrives." },
          { ne: "आकाश", tr: "aakaash", correct: false, why: "Der Himmel ist das Ganze da oben – die Wolke ist nur ein Stück davon.", whyEn: "The sky is the whole thing up there – the cloud is just a piece of it." },
          { ne: "सूर्य", tr: "surya", correct: false, why: "Die Sonne kommt gleich – das hier war eine Wolke.", whyEn: "The sun comes next – this was a cloud." }
        ]
      }
    },
    {
      id: "c5s3", title: "Über den Wolken", titleEn: "Above the Clouds", art: "sunrise", xpBonus: 20,
      intro: "Dann bricht das Licht über den Schneegipfeln auf – und du verstehst, warum Menschen für diesen Moment aufstehen.",
      introEn: "Then light breaks over the snow peaks – and you understand why people get up for this moment.",
      reveal: { q: "Was heißt सुन्दर?", qEn: "What does सुन्दर mean?", a: "sundar = wunderschön", aEn: "sundar = beautiful" },
      items: ["l13_05"],
      warmups: ["l13_03", "l13_04"],
      choice: {
        q: "Wie beschreibst du den Moment?",
        qEn: "How do you describe the moment?",
        options: [
          { ne: "सुन्दर!", tr: "sundar!", correct: true, why: "Wunderschön – das Wort für genau diesen Sonnenaufgang.", whyEn: "Beautiful – the word for exactly this sunrise." },
          { ne: "राम्रो", tr: "raamro", correct: false, why: "Auch richtig – aber für DIESEN Moment gibt was Größeres: sundar.", whyEn: "Also right – but for THIS moment there's something bigger: sundar." },
          { ne: "गरम", tr: "garam", correct: false, why: "Heiß? Bei diesem Frost? Eher nicht.", whyEn: "Hot? In this frost? Hardly." }
        ]
      }
    }
  ]
};

// Kapitel 6 – Pokhara: Am Phewa-See
window.CHAPTER6 = {
  id: "chap6", title: "Pokhara – am See", titleEn: "Pokhara – by the lake",
  scenes: [
    {
      id: "c6s1", title: "Ankunft am See", titleEn: "Arrival at the Lake", art: "lake", xpBonus: 15,
      intro: "Nach den Bergen eine andere Welt: ein See, so ruhig, dass sich die Berge darin spiegeln.",
      introEn: "After the mountains, a different world: a lake so still that the mountains mirror themselves in it.",
      reveal: { q: "Was heißt ताल?", qEn: "What does ताल mean?", a: "taal = See", aEn: "taal = lake" },
      items: ["l14_01", "l14_02"],
      warmups: ["l5_05", "l3_02"],
      choice: {
        q: "Am Ufer liegen bunte Boote. Was ist das?",
        qEn: "Colorful boats lie along the shore. What are they?",
        options: [
          { ne: "डुङ्गा", tr: "dungaa", correct: true, why: "Ein Boot – gleich fährst du damit raus.", whyEn: "A boat – you'll ride out on one soon." },
          { ne: "ताल", tr: "taal", correct: false, why: "Der See ist das ganze Wasser – gemeint waren die Boote darauf.", whyEn: "The lake is all the water – the boats on it were meant." },
          { ne: "नदी", tr: "nadi", correct: false, why: "Ein Fluss fließt – der See liegt still.", whyEn: "A river flows – the lake lies still." }
        ]
      }
    },
    {
      id: "c6s2", title: "Bootsfahrt", titleEn: "Boat Ride", art: "lake", xpBonus: 15,
      intro: "Ruhiges Paddeln, kreisende Vögel, und unter dir ziehen Fische vorbei. Die Berge schauen zu.",
      introEn: "Quiet paddling, circling birds, and fish glide beneath you. The mountains watch.",
      reveal: { q: "Was heißt माछा?", qEn: "What does माछा mean?", a: "maachha = Fisch", aEn: "maachha = fish" },
      items: ["l14_03"],
      warmups: ["l14_01", "l14_02"],
      choice: {
        q: "Im Wasser unter dir glitzert etwas Silbernes. Was schwimmt da?",
        qEn: "Something silver glitters in the water below you. What is swimming there?",
        options: [
          { ne: "माछा", tr: "maachha", correct: true, why: "Fische – der See ist voll davon.", whyEn: "Fish – the lake is full of them." },
          { ne: "चरा", tr: "chara", correct: false, why: "Vögel fliegen über dem See, nicht durch ihn.", whyEn: "Birds fly over the lake, not through it." },
          { ne: "पानी", tr: "paani", correct: false, why: "Wasser ist alles um dich herum – gemeint war das Tier.", whyEn: "Water is everything around you – the animal was meant." }
        ]
      }
    },
    {
      id: "c6s3", title: "Café mit Bergblick", titleEn: "Café with a Mountain View", art: "cafe", xpBonus: 20,
      intro: "Der Tag endet in einem Café am Ufer, die Füße hoch, die Annapurnas im Blick. Verdiente Erholung – आराम.",
      introEn: "The day ends in a café on the shore, feet up, the Annapurnas in view. Well-earned rest – आराम.",
      reveal: { q: "Was heißt आराम?", qEn: "What does आराम mean?", a: "aaraam = Ruhe, Erholung", aEn: "aaraam = rest, relaxation" },
      items: ["l14_04"],
      warmups: ["l10_01", "l10_03"],
      choice: {
        q: "Wie fühlst du dich nach diesem Tag?",
        qEn: "How do you feel after this day?",
        options: [
          { ne: "आराम", tr: "aaraam", correct: true, why: "Völlige Ruhe – Pokhara ist der Erholungsort schlechthin.", whyEn: "Complete rest – Pokhara is the relaxation spot." },
          { ne: "छिटो", tr: "chhito", correct: false, why: "Schnell war der Morgen in Nagarkot – hier zählt das Gegenteil.", whyEn: "Fast was the morning in Nagarkot – here the opposite counts." },
          { ne: "चिसो", tr: "chiso", correct: false, why: "Kalt wars in der Nacht – das Gefühl hier ist Erholung.", whyEn: "Cold was the night – the feeling here is rest." }
        ]
      }
    }
  ]
};

// Kapitel 7 – Lumbini: Der Garten
window.CHAPTER7 = {
  id: "chap7", title: "Lumbini – der Garten", titleEn: "Lumbini – the garden",
  scenes: [
    {
      id: "c7s1", title: "Der Garten", titleEn: "The Garden", art: "lotus", xpBonus: 15,
      intro: "Lumbini: der Ort, an dem Buddha geboren wurde. Ein Garten voller Bäume, Teiche und Blumen – und eine Stille, die man hören kann.",
      introEn: "Lumbini: the place where Buddha was born. A garden full of trees, ponds and flowers – and a stillness you can hear.",
      reveal: { q: "Was heißt फूल?", qEn: "What does फूल mean?", a: "phool = Blume", aEn: "phool = flower" },
      items: ["l15_01", "l15_02"],
      warmups: ["l14_01", "l11_01"],
      choice: {
        q: "Im Teich schwimmen rosa Blüten. Was sind das?",
        qEn: "Pink blossoms float in the pond. What are they?",
        options: [
          { ne: "फूल", tr: "phool", correct: true, why: "Blumen – in Lumbini überall, besonders die Lotusblüten.", whyEn: "Flowers – everywhere in Lumbini, especially the lotus blossoms." },
          { ne: "रूख", tr: "ruukh", correct: false, why: "Bäume stehen am Ufer – im Wasser schwimmen Blumen.", whyEn: "Trees stand on the shore – flowers float in the water." },
          { ne: "माछा", tr: "maachha", correct: false, why: "Fische gibt es auch – aber rosa Blüten sind Blumen.", whyEn: "There are fish too – but pink blossoms are flowers." }
        ]
      }
    },
    {
      id: "c7s2", title: "Die Stille", titleEn: "The Stillness", art: "lotus", xpBonus: 15,
      intro: "Pilger aus aller Welt sitzen im Schatten, Augen geschlossen. Hier lernt Nepal sein ruhigstes Wort.",
      introEn: "Pilgrims from all over the world sit in the shade, eyes closed. Here you learn Nepal's quietest word.",
      reveal: { q: "Was heißt ध्यान?", qEn: "What does ध्यान mean?", a: "dhyaan = Meditation, Stille", aEn: "dhyaan = meditation, stillness" },
      items: ["l15_03", "l15_04"],
      warmups: ["l11_05", "l11_01"],
      choice: {
        q: "Wer wurde hier geboren?",
        qEn: "Who was born here?",
        options: [
          { ne: "बुद्ध", tr: "buddha", correct: true, why: "Buddha – deshalb kommen die Pilger aus aller Welt hierher.", whyEn: "Buddha – that's why pilgrims come here from all over the world." },
          { ne: "बानर", tr: "baanar", correct: false, why: "Affen gibt es in Swayambhu – hier regiert die Stille.", whyEn: "Monkeys live in Swayambhu – here stillness rules." },
          { ne: "बाघ", tr: "baagh", correct: false, why: "Tiger leben im Dschungel von Chitwan, nicht im heiligen Garten.", whyEn: "Tigers live in the jungle of Chitwan, not in the sacred garden." }
        ]
      }
    },
    {
      id: "c7s3", title: "Ein Mönch nickt dir zu", titleEn: "A Monk Nods at You", art: "lotus", xpBonus: 20,
      intro: "Beim Abschied nickt dir ein alter Mönch zu. Du nickst zurück – manche Gespräche brauchen keine Wörter. Und doch: ein paar Basis-Wörter nimmst du mit.",
      introEn: "As you leave, an old monk nods at you. You nod back – some conversations need no words. And still: you take a few basic words with you.",
      reveal: { q: "Was war das ruhigste Wort dieser Reise?", qEn: "What was the quietest word of this journey?", a: "शान्त (shaanta) – ruhig", aEn: "शान्त (shaanta) – calm" },
      items: [],
      warmups: ["l11_05", "l15_03", "l1_02"],
      choice: {
        q: "Du willst dem Mönch danken. Was sagst du?",
        qEn: "You want to thank the monk. What do you say?",
        options: [
          { ne: "धन्यवाद", tr: "dhanyabaad", correct: true, why: "Danke – das erste große Wort der Reise, hier am ruhigsten Ort.", whyEn: "Thank you – the journey's first big word, here at its quietest place." },
          { ne: "नमस्ते", tr: "namaste", correct: false, why: "Auch schön zum Abschied – aber gefragt war der Dank.", whyEn: "Also lovely for goodbye – but the thanks was asked for." },
          { ne: "खुशी", tr: "khushi", correct: false, why: "Freude fühlst du – gesagt haben willst du danke.", whyEn: "Joy is what you feel – what you want to say is thank you." }
        ]
      }
    }
  ]
};

// Kapitel 8 – Chitwan: Im Dschungel
window.CHAPTER8 = {
  id: "chap8", title: "Chitwan – im Dschungel", titleEn: "Chitwan – in the jungle",
  scenes: [
    {
      id: "c8s1", title: "Die Safari", titleEn: "The Safari", art: "jungle", xpBonus: 15,
      intro: "Zurück ins Getümmel: Der Jeep rumpelt in den Dschungel. Hohes Gras, heiße Luft – und irgendwo da draußen: Tiger.",
      introEn: "Back into the thick of it: the jeep rattles into the jungle. Tall grass, hot air – and somewhere out there: tigers.",
      reveal: { q: "Was heißt जनावर?", qEn: "What does जनावर mean?", a: "janaawar = Tier", aEn: "janaawar = animal" },
      items: ["l16_03", "l16_01"],
      warmups: ["l5_04", "l16_02"],
      choice: {
        q: "Vor dir graut etwas Riesiges durchs Gras – ein grauer Riese mit Rüssel. Was ist das?",
        qEn: "Something huge looms grey through the grass – a grey giant with a trunk. What is it?",
        options: [
          { ne: "हात्ती", tr: "haatti", correct: true, why: "Ein Elefant! In Chitwan leben wild lebende und Arbeitselefanten.", whyEn: "An elephant! Chitwan has wild ones and working ones." },
          { ne: "बाघ", tr: "baagh", correct: false, why: "Tiger sind gestreift und schleichen – der Graue mit Rüssel ist ein Elefant.", whyEn: "Tigers are striped and stealthy – the grey one with a trunk is an elephant." },
          { ne: "जनावर", tr: "janaawar", correct: false, why: "Stimmt – aber die genaue Antwort heißt haatti.", whyEn: "True – but the precise answer is haatti." }
        ]
      }
    },
    {
      id: "c8s2", title: "Das Nashorn", titleEn: "The Rhino", art: "jungle", xpBonus: 15,
      intro: "Am Flussufer: ein Panzernashorn im Schlamm. Dein Guide flüstert: सावधान! Vorsicht – du kennst das Wort schon.",
      introEn: "At the riverbank: a one-horned rhino in the mud. Your guide whispers: सावधान! Careful – you already know this word.",
      reveal: { q: "Was heißt सावधान?", qEn: "What does सावधान mean?", a: "saavadhaan = Vorsicht!", aEn: "saavadhaan = careful!" },
      items: ["l16_02"],
      warmups: ["l7_09", "l5_05"],
      choice: {
        q: "Das Nashorn schaut hoch. Was macht dein Guide?",
        qEn: "The rhino looks up. What does your guide do?",
        options: [
          { ne: "सावधान!", tr: "saavadhaan!", correct: true, why: "Vorsicht! – Notfall-Wort aus Kapitel 1, hier Gold wert.", whyEn: "Careful! – the emergency word from chapter 1, worth gold here." },
          { ne: "छिटो!", tr: "chhito!", correct: false, why: "Schnell wegrennen? Beim Nashorn gilt: ruhig bleiben, laut sein.", whyEn: "Run fast? With a rhino the rule is: stay calm, be loud." },
          { ne: "मीठो!", tr: "mitho!", correct: false, why: "Lecker? Bitte nicht das Nashorn anfassen.", whyEn: "Delicious? Please don't pet the rhino." }
        ]
      }
    },
    {
      id: "c8s3", title: "Lagerfeuer", titleEn: "Campfire", art: "jungle", xpBonus: 20,
      intro: "Abends am Lagerfeuer, Funken steigen in die Nacht. Der Guide erzählt von Tigern – du hörst zu, verstehst Brocken, und fühlst dich mittendrin.",
      introEn: "Evening at the campfire, sparks rising into the night. The guide tells tiger stories – you listen, catch fragments, and feel right in the middle of it.",
      reveal: { q: "Was heißt आगो?", qEn: "What does आगो mean?", a: "aago = Feuer", aEn: "aago = fire" },
      items: ["l16_04"],
      warmups: ["l5_07", "l16_03"],
      choice: {
        q: "Was knistert da vor dir in der Nacht?",
        qEn: "What is crackling there in front of you in the night?",
        options: [
          { ne: "आगो", tr: "aago", correct: true, why: "Das Feuer – der warme Mittelpunkt jedes Dschungel-Abends.", whyEn: "The fire – the warm center of every jungle evening." },
          { ne: "बादल", tr: "baadal", correct: false, why: "Wolken sind oben – das Knistern kommt vom Feuer.", whyEn: "Clouds are up above – the crackling comes from the fire." },
          { ne: "रात", tr: "raat", correct: false, why: "Die Nacht ist die Zeit – das Feuer ist das Ding davor.", whyEn: "The night is the time – the fire is the thing in front of you." }
        ]
      }
    }
  ]
};

// Kapitel 9 – Everest Base Camp: Das Dach der Welt
window.CHAPTER9 = {
  id: "chap9", title: "Everest – das Dach der Welt", titleEn: "Everest – the roof of the world",
  scenes: [
    {
      id: "c9s1", title: "Der letzte Weg", titleEn: "The Final Path", art: "summit", xpBonus: 15,
      intro: "Der Anfang vom Ende: Staubpfade, Hängebrücken, Gebetsfahnen im Wind. Und immer höher der Schnee.",
      introEn: "The beginning of the end: dust trails, suspension bridges, prayer flags in the wind. And ever higher, the snow.",
      reveal: { q: "Was heißt हिउँ?", qEn: "What does हिउँ mean?", a: "hiun = Schnee", aEn: "hiun = snow" },
      items: ["l17_01", "l17_02"],
      warmups: ["l5_01", "l5_03"],
      choice: {
        q: "Unter euch rauscht klares Wasser vom Gletscher. Was ist das?",
        qEn: "Below you, clear glacier water rushes past. What is it?",
        options: [
          { ne: "खोला", tr: "kholaa", correct: true, why: "Ein Bach – hier oben geboren aus Schnee und Eis.", whyEn: "A stream – born up here from snow and ice." },
          { ne: "ताल", tr: "taal", correct: false, why: "Ein See liegt still – das hier fließt und rauscht.", whyEn: "A lake lies still – this one flows and rushes." },
          { ne: "हिउँ", tr: "hiun", correct: false, why: "Schnee ist weiß und liegt – das Wasser heißt kholaa.", whyEn: "Snow is white and lies still – the water is kholaa." }
        ]
      }
    },
    {
      id: "c9s2", title: "Dünne Luft", titleEn: "Thin Air", art: "summit", xpBonus: 15,
      intro: "Jeder Schritt zählt, die Luft wird dünn. Kein neues Wort heute – nur du, dein Atem, und das alte बिस्तारै: langsam, langsam.",
      introEn: "Every step counts, the air gets thin. No new word today – just you, your breath, and old बिस्तारै: slowly, slowly.",
      reveal: { q: "Wie heißt nochmal „langsam“?", qEn: "What was “slowly” again?", a: "बिस्तारै (bistaarai) – du kennst es von „Sprechen Sie langsamer“", aEn: "बिस्तारै (bistaarai) – you know it from “please speak more slowly”" },
      items: [],
      warmups: ["l1_16", "l5_03", "l13_02"],
      choice: {
        q: "Dein Sherpa sagt: बिस्तारै! Was bedeutet das für dich?",
        qEn: "Your Sherpa says: बिस्तारै! What does that mean for you?",
        options: [
          { ne: "बिस्तारै", tr: "bistaarai", correct: true, why: "Genau – hier oben ist langsam das klügste Tempo der Welt.", whyEn: "Exactly – up here slow is the wisest pace in the world." },
          { ne: "छिटो!", tr: "chhito!", correct: false, why: "Schnell ist hier oben gefährlich – bistaarai heißt langsam.", whyEn: "Fast is dangerous up here – bistaarai means slow." },
          { ne: "बिस्तारै बोल्नुहोस्", tr: "bistaarai bolnuhos", correct: false, why: "„Sprechen Sie langsamer“ – kennst du! Aber der Sherpa meint das Gehen.", whyEn: "“Speak more slowly” – you know it! But the Sherpa means walking." }
        ]
      }
    },
    {
      id: "c9s3", title: "Base Camp!", titleEn: "Base Camp!", art: "summit", xpBonus: 20,
      intro: "Gelbe Zelte, bunte Fahnen, und über allem: der Everest. Du bist angekommen – am Dach der Welt.",
      introEn: "Yellow tents, colorful flags, and above everything: Everest. You have arrived – on the roof of the world.",
      reveal: { q: "Was heißt झन्डा?", qEn: "What does झन्डा mean?", a: "jhandaa = Fahne", aEn: "jhandaa = flag" },
      items: ["l17_03"],
      warmups: ["l17_01", "l12_07"],
      choice: {
        q: "Im Wind flattern Dutzend bunte Fahnen über dem Camp. Was weht da?",
        qEn: "Dozens of colorful flags flutter over the camp. What is waving?",
        options: [
          { ne: "झन्डा", tr: "jhandaa", correct: true, why: "Fahnen – die Gebetsfahnen segnen den Weg für alle, die nach dir kommen.", whyEn: "Flags – the prayer flags bless the path for everyone who comes after you." },
          { ne: "बादल", tr: "baadal", correct: false, why: "Wolken ziehen hoch oben – das Bunte am Seil sind Fahnen.", whyEn: "Clouds drift up high – the colorful things on the rope are flags." },
          { ne: "चरा", tr: "chara", correct: false, why: "Vögel fliegen so hoch oben kaum – hier wehen Fahnen.", whyEn: "Birds barely fly this high – here flags wave." }
        ]
      }
    },
    {
      id: "c9s4", title: "Das Finale", titleEn: "The Finale", art: "summit", xpBonus: 30,
      intro: "Abends sitzt du vor dem Zelt, der Himmel voller Sterne. Vor Wochen hast du in Kathmandu noch kein Wort verstanden. Heute hast du die Basis – und ein Land voll im Herzen.",
      introEn: "In the evening you sit in front of the tent, the sky full of stars. Weeks ago you didn't understand a single word in Kathmandu. Today you have the basics – and a country full in your heart.",
      reveal: { q: "Wie heißt dieses Land auf Nepali?", qEn: "What is this country called in Nepali?", a: "नेपाल (Nepaal)" },
      items: ["l17_04"],
      warmups: ["l1_06", "l12_07"],
      endBonus: "Du hast die Basis gemeistert – धन्यवाद, नेपाल!",
      endBonusEn: "You've mastered the basics – धन्यवाद, नेपाल!",
      choice: {
        q: "Ein letzter Blick auf die Berge. Was flüsterst du?",
        qEn: "One last look at the mountains. What do you whisper?",
        options: [
          { ne: "धन्यवाद, नेपाल!", tr: "dhanyabaad, Nepaal!", correct: true, why: "Danke, Nepal – für alles. Die Reise ist komplett.", whyEn: "Thank you, Nepal – for everything. The journey is complete." },
          { ne: "फेरि भेटौंला", tr: "pheri bhetaunlaa", correct: false, why: "„Auf Wiedersehen“ – fast perfekt, aber der Moment will den Dank.", whyEn: "“Goodbye” – nearly perfect, but this moment calls for thanks." },
          { ne: "सुन्दर!", tr: "sundar!", correct: false, why: "Wunderschön ist es – aber dieses letzte Wort gehört dem Dank.", whyEn: "It is beautiful – but this last word belongs to thanks." }
        ]
      }
    }
  ]
};


// Gamification-Inhalte v2: Reise, Buchstaben, Höflichkeit, Story, Challenges, Grammatik-Tipps
window.JOURNEY = {
  stops: [
    { id: "kathmandu", name: "Kathmandu", sub: "Ankunft in Nepal", subEn: "Arrival in Nepal", xp: 0 },
    { id: "thamel", name: "Thamel", sub: "Deine Basis im Getümmel", subEn: "Your base in the bustle", xp: 30 },
    { id: "swayambhu", name: "Swayambhu", sub: "Der Affentempel", subEn: "The Monkey Temple", xp: 90 },
    { id: "bhaktapur", name: "Bhaktapur", sub: "Die rote Stadt", subEn: "The red city", xp: 170 },
    { id: "nagarkot", name: "Nagarkot", sub: "Sonnenaufgang überm Himalaya", subEn: "Sunrise over the Himalaya", xp: 270 },
    { id: "pokhara", name: "Pokhara", sub: "Am Phewa-See", subEn: "On Phewa Lake", xp: 400 },
    { id: "lumbini", name: "Lumbini", sub: "Geburtsort Buddhas", subEn: "Birthplace of Buddha", xp: 560 },
    { id: "chitwan", name: "Chitwan", sub: "Im Dschungel", subEn: "In the jungle", xp: 750 },
    { id: "everest", name: "Everest Base Camp", sub: "Das Dach der Welt", subEn: "The roof of the world", xp: 1000 }
  ]
};

// Devanagari-Buchstaben: id, Zeichen, Laut, Eselsbrücke (hint/hintEn), Beispielwort (optional)
window.LETTERS = [
  { id: "let_01", ch: "अ", sound: "a", hint: "Ein Hocker mit Fahne – der Grundvokal, aus dem alle anderen entstehen", hintEn: "A stool with a pennant – the base vowel all others grow from" },
  { id: "let_02", ch: "क", sound: "ka", hint: "Ein Kamm an einer Stange – wie ein ,k' mit Zähnen", hintEn: "A comb on a pole – like a ‘k’ with teeth", word: "कस्तो" },
  { id: "let_03", ch: "ग", sound: "ga", hint: "Eine 3 mit Schlinge – weich wie ,g' in ,gut'", hintEn: "A 3 with a sling – soft like the ‘g’ in ‘go’", word: "गर्नुहोस्" },
  { id: "let_04", ch: "च", sound: "cha", hint: "Ein ,y' mit verknotetem Bein", hintEn: "A ‘y’ with a knotted leg", word: "चार" },
  { id: "let_05", ch: "ज", sound: "ja", hint: "Eine 8 mit Schnur überm Kopf – wie ,j' in ,Jahr'", hintEn: "An 8 with a string overhead – like the ‘j’ in ‘jar’", word: "जर्मनबाट" },
  { id: "let_06", ch: "त", sound: "ta", hint: "Eine 3 mit Kappe und Bein – weiches ,t' wie in ,Wasser'", hintEn: "A 3 with a cap and a leg – a soft ‘t’ as in ‘water’", word: "तपाईं" },
  { id: "let_07", ch: "द", sound: "da", hint: "Eine 6 mit zwei Wimpern – weiches ,d' wie in ,Paderborn'", hintEn: "A 6 with two eyelashes – a soft ‘d’ as in ‘udder’" },
  { id: "let_08", ch: "न", sound: "na", hint: "Ein ,n' unter der Wäscheleine – die Oberlinie gilt für alle Buchstaben", hintEn: "An ‘n’ under the clothesline – the top line applies to every letter", word: "नमस्ते" },
  { id: "let_09", ch: "म", sound: "ma", hint: "Ein ,u' mit Krone und Zipfel – wie in ,ममा'… äh, माया (Liebe)", hintEn: "A ‘u’ with a crown and a tail – as in माया (love)", word: "माया" },
  { id: "let_10", ch: "र", sound: "ra", hint: "Eine tanzende 2 mit Peitsche – rollendes ,r' willkommen", hintEn: "A dancing 2 with a whip – a rolled ‘r’ is welcome", word: "राम्रो" },
  { id: "let_11", ch: "ल", sound: "la", hint: "Ein Löffel mit Anlauf", hintEn: "A spoon taking a run-up", word: "लाई" },
  { id: "let_12", ch: "स", sound: "sa", hint: "Eine 8 mit Schnürsenkel", hintEn: "An 8 with a shoelace", word: "स्वागत" }
];

// Höflichkeits-Detektiv: Nepali kennt drei „du"-Stufen
window.DETECTIVE = {
  intro: {
    title: "Drei Stufen von „du“",
    titleEn: "Three levels of “you”",
    body: "Nepali unterscheidet, WEN du ansprichst – mit drei verschiedenen „du“:",
    bodyEn: "Nepali distinguishes WHO you are addressing – with three different “you”s:",
    levels: [
      { ne: "तँ", tr: "ta", de: "ganz niedrig – kleine Kinder, sehr Intimes; für Fremde eine Beleidigung!", en: "very low – small children, the most intimate; an insult to strangers!" },
      { ne: "तिमी", tr: "timi", de: "locker – Freunde, Familie, Gleichaltrige", en: "casual – friends, family, peers" },
      { ne: "तपाईं", tr: "tapaai", de: "respektvoll – Fremde, Ältere, Amtspersonen, Kunden", en: "respectful – strangers, elders, officials, customers" }
    ]
  },
  scenes: [
    { id: "det_1", who: "Ein buddhistischer Mönch im Kloster", whoEn: "A Buddhist monk at the monastery", answer: "tapaai" },
    { id: "det_2", who: "Dein bester Freund aus Kathmandu", whoEn: "Your best friend from Kathmandu", answer: "timi" },
    { id: "det_3", who: "Der 5-jährige Sohn deiner Gastfamilie", whoEn: "Your host family's 5-year-old son", answer: "ta" },
    { id: "det_4", who: "Ein Polizist, der deinen Pass prüft", whoEn: "A police officer checking your passport", answer: "tapaai" },
    { id: "det_5", who: "Dein Zimmergenosse im Hostel, 24 Jahre", whoEn: "Your hostel roommate, 24 years old", answer: "timi" },
    { id: "det_6", who: "Die Inhaberin des Teeladens", whoEn: "The owner of the tea shop", answer: "tapaai" }
  ]
};

// Story 1: Taxi nach Thamel – Schritt für Schritt, mit Auswahl
window.STORY1 = {
  id: "st1",
  title: "Taxi nach Thamel",
  titleEn: "Taxi to Thamel",
  place: "Kathmandu · Flughafen",
  placeEn: "Kathmandu · Airport",
  steps: [
    { type: "narr", de: "Du bist gerade in Kathmandu gelandet. Dein Rucksack ist schwer, und dein Hostel liegt in Thamel. Vor dir hält ein Taxi. Der Fahrer grinst und fragt:",
      en: "You have just landed in Kathmandu. Your backpack is heavy, and your hostel is in Thamel. A taxi pulls up in front of you. The driver grins and asks:",
      reveal: { q: "Wo liegt dein Hostel?", qEn: "Where is your hostel?", a: "In Thamel (थमेल)" } },
    { type: "line", who: "Taxi-Fahrer", whoEn: "Taxi driver", ne: "नमस्ते! कहाँ जानुहोस्?", tr: "namaste! kahaan jaanuhos?", de: "Namaste! Wohin gehen Sie?", en: "Namaste! Where are you going?", audio: "st1_01",
      note: "कहाँ (kahaan) = wo · जानुहोस् (jaanuhos) = gehen Sie", noteEn: "कहाँ (kahaan) = where · जानुहोस् (jaanuhos) = go (polite)" },
    { type: "choice", de: "Wohin willst du? Antworte dem Fahrer:",
      en: "Where do you want to go? Answer the driver:",
      options: [
        { ne: "मलाई थमेल जानुपर्छ।", tr: "malaai Thamel jaanuparchha.", de: "Ich muss nach Thamel.", en: "I need to go to Thamel.", correct: true, audio: "st1_02" },
        { ne: "मेरो नाम माया हो।", tr: "mero naam Maaya ho.", de: "Mein Name ist Maya.", en: "My name is Maya.", correct: false,
          why: "Nett, aber der Fahrer will dein Ziel wissen, nicht deinen Namen. मलाई … जानुपर्छ = „Ich muss nach …“",
          whyEn: "Nice, but the driver wants your destination, not your name. मलाई … जानुपर्छ = “I need to go to …”" }
      ] },
    { type: "line", who: "Taxi-Fahrer", whoEn: "Taxi driver", ne: "ठीक छ, आउनुहोस्।", tr: "thik chha, aaunuhos.", de: "In Ordnung, steigen Sie ein.", en: "All right, get in.", audio: "st1_03" },
    { type: "narr", de: "Die Fahrt rumpelt über Schlaglöcher, Räder hupen, ein Hund weicht aus. In Thamel hält das Taxi. Du willst den Preis wissen – welche Frage stellst du?",
      en: "The ride rattles over potholes, wheels honk, a dog dodges aside. In Thamel the taxi stops. You want to know the price – which question do you ask?",
      reveal: { q: "Wie heißt nochmal „wie viel“?", qEn: "What was “how much” again?", a: "कति (kati)" } },
    { type: "choice", de: "Frage nach dem Preis:",
      en: "Ask for the price:",
      options: [
        { ne: "यो कति हो?", tr: "yo kati ho?", de: "Was kostet das?", en: "How much is this?", correct: true, audio: "st1_04" },
        { ne: "यो कहाँ हो?", tr: "yo kahaan ho?", de: "Wo ist das?", en: "Where is this?", correct: false,
          why: "Fast! कहाँ = „wo“ – du brauchst aber कति = „wie viel“. Merk dir: कति mit dem i-Ende wie „Kost-et was?“",
          whyEn: "Close! कहाँ = “where” – but you need कति = “how much”. Memory hook: कति ends in ‘i’, like the ‘i’ in “how much is it?”" }
      ] },
    { type: "line", who: "Taxi-Fahrer", whoEn: "Taxi driver", ne: "पचास रुपैयाँ।", tr: "pachaas rupaiyaa.", de: "Fünfzig Rupien.", en: "Fifty rupees.", audio: "st1_05" },
    { type: "narr", de: "Du zahlst, steigst aus. Beim Abschied bedankst du dich – und der Fahrer ruft dir hinterher:",
      en: "You pay and get out. As you say goodbye you thank him – and the driver calls after you:",
      reveal: { q: "Wie verabschiedet man sich auf Nepali?", qEn: "How do you say goodbye in Nepali?", a: "फेरि भेटौंला (pheri bhetaunlaa) – „bis wir uns wiedersehen“", aEn: "फेरि भेटौंला (pheri bhetaunlaa) – “until we meet again”" } },
    { type: "line", who: "Taxi-Fahrer", whoEn: "Taxi driver", ne: "फेरि भेटौंला, धन्यवाद!", tr: "pheri bhetaunlaa, dhanyabaad!", de: "Auf Wiedersehen – danke!", en: "Goodbye – thank you!", audio: "st1_06" },
    { type: "end", de: "Angekommen in Thamel! Du hast gerade deinen ersten echten Dialog auf Nepali überstanden.",
      en: "You've arrived in Thamel! You just made it through your first real dialogue in Nepali.",
      bonus: "Culture: beim Feilschen über den Preis ist Handeln normal – lächeln und „अलि कम गर्नुहोस्“ (etwas weniger, bitte) bringt dich weit.",
      bonusEn: "Culture: haggling over the price is normal – smile and say “अलि कम गर्नुहोस्” (a little less, please) and you'll go far." }
  ]
};

// Tägliche Challenges (eine pro Tag, Bonus-XP) – Devanagari immer mit Umschrift, damit A0 lesbar bleibt
window.CHALLENGES = [
  { id: "ch1", de: "Schreib नमस्ते (namaste) auf einen Zettel und kleb ihn an deinen Spiegel.",
    en: "Write नमस्ते (namaste) on a note and stick it to your mirror.",
    gloss: "नमस्ते (namaste) = Hallo / Grüß dich – wörtlich: „ich verneige mich vor dir“.",
    glossEn: "नमस्ते (namaste) = hello – literally: “I bow to you”." },
  { id: "ch2", de: "Such auf YouTube ein nepalesisches Lied und lausch, ob du माया (maaya – Liebe) heraushörst.",
    en: "Find a Nepali song on YouTube and listen for माया (maaya – love).",
    gloss: "माया (maaya) = Liebe – kommt in fast jedem nepalesischen Lied vor.",
    glossEn: "माया (maaya) = love – it shows up in almost every Nepali song." },
  { id: "ch3", de: "Zähl heute fünf Dinge in deiner Wohnung auf Nepali: ek, dui, tin, chaar, paanch (एक दुई तीन चार पाँच).",
    en: "Count five things in your home in Nepali today: ek, dui, tin, chaar, paanch (एक दुई तीन चार पाँच).",
    gloss: "एक (ek) = 1 · दुई (dui) = 2 · तीन (tin) = 3 · चार (chaar) = 4 · पाँच (paanch) = 5",
    glossEn: "एक (ek) = 1 · दुई (dui) = 2 · तीन (tin) = 3 · चार (chaar) = 4 · पाँच (paanch) = 5" },
  { id: "ch4", de: "Schreib deinen Namen in Devanagari – Frag mich, wenn du Hilfe brauchst: die Silben bauen sich aus den Buchstaben der Lektion auf.",
    en: "Write your name in Devanagari – ask me if you need help: the syllables build from the letters in the lesson.",
    gloss: "Devanagari = die Schrift des Nepali. Jede Silbe ist ein Zeichen – die ersten 12 zeigt die Session „Devanagari enträtseln“.",
    glossEn: "Devanagari = the script of Nepali. Every syllable is one character – the first 12 are in the “Decode Devanagari” session." },
  { id: "ch5", de: "Sag heute zu einem Menschen „namaste“ – mit gefalteten Händen, नमस्ते-Style.",
    en: "Say “namaste” to someone today – with folded hands, नमस्ते-style.",
    gloss: "नमस्ते (namaste) = der nepalesische Gruß. Die Geste mit gefalteten Händen heißt „namaskar“.",
    glossEn: "नमस्ते (namaste) = the Nepali greeting. The folded-hand gesture is called “namaskar”." },
  { id: "ch6", de: "Üb das nepalesische Kopf-Wackeln: Kopf seitlich rollen bedeutet „alles klar“ – mach es dreimal, jetzt.",
    en: "Practice the Nepali head wobble: rolling your head sideways means “all good” – do it three times, now.",
    gloss: "Das seitliche Kopf-Rollen heißt so viel wie „ja / alles klar / okay“ – es ist Nicks, Wackeln und Achselzucken in einem.",
    glossEn: "The sideways head roll means “yes / all right / okay” – it's a nod, a wobble and a shrug in one." },
  { id: "ch7", de: "Trink heute deinen Tee wie in Nepal: mit Milch und Zucker (chiya – चिया) und sag vorher zufrieden „thik chha!“.",
    en: "Drink your tea the Nepali way today: with milk and sugar (chiya – चिया), and say a content “thik chha!” first.",
    gloss: "चिया (chiya) = Tee mit Milch und Zucker · ठीक छ (thik chha) = „alles klar / gut“.",
    glossEn: "चिया (chiya) = tea with milk and sugar · ठीक छ (thik chha) = “all right / good”." },
  { id: "ch8", de: "Erinnere dich an drei Wörter aus der letzten Session, ohne in die App zu schauen – dann prüf nach.",
    en: "Recall three words from your last session without opening the app – then check.",
    gloss: "Tipp: Sag die Wörter laut aus – was du aussprichst, bleibt viel besser hängen.",
    glossEn: "Tip: Say the words out loud – what you speak aloud sticks far better." }
];
// Grammatik im Sprachvergleich (Deutsch/Englisch ↔ Nepali)
window.GRAMMAR_TIPS = [
  { id: "gt1", title: "Das Verb wandert ans Ende",
    titleEn: "The verb moves to the end",
    de: "Deutsch: Ich bin okay → Subjekt-Verb-Rest. Nepali: म ठीक छु (ma thik chhu) = „Ich okay bin“ – Subjekt-Rest-Verb. Das Verb छु (bin) steht ganz hinten.",
    en: "English: I am fine → subject-verb-rest. Nepali: म ठीक छु (ma thik chhu) = “I fine am” – subject-rest-verb. The verb छु (am) sits at the very end.",
    ne: "म ठीक छु।", tr: "ma thik chhu." },
  { id: "gt2", title: "Kein der/die/das",
    titleEn: "No articles at all",
    de: "Nepali hat keine Artikel. किताब heißt einfach „Buch“ – die Wäscheleine oben zeigt nur, dass es ein Wort ist, nicht sein Geschlecht.",
    en: "Nepali has no articles. किताब simply means “book” – the clothesline above only marks that it's a word, not its gender.",
    ne: "किताब", tr: "kitaab" },
  { id: "gt3", title: "Präpositionen hängen hinten dran",
    titleEn: "Prepositions attach at the back",
    de: "Deutsch: AUS Deutschland. Nepali: जर्मनबाट = जर्मन (Deutschland) + बाट (aus). Aus Präposition wird Nachsilbe – wie lateinisch „ex“ als Anhängsel.",
    en: "English: FROM Germany. Nepali: जर्मनबाट = जर्मन (Germany) + बाट (from). The preposition becomes a suffix – “Germany-from”, attached at the back.",
    ne: "म जर्मनबाट आएको हुँ।", tr: "ma Jarmanbaata aeko hun." },
  { id: "gt4", title: "Höflichkeit steckt im Verb",
    titleEn: "Politeness lives in the verb",
    de: "Deutsch macht „Sie“ mit Pronomen. Nepali baut die Höflichkeit ins Verbende: जानुहोस् (gehen Sie) vs. जा (geh!). Ein Satz, zwei Welten.",
    en: "English makes politeness with “please”. Nepali builds it into the verb ending: जानुहोस् (please go) vs. जा (go!). One sentence, two worlds.",
    ne: "बिस्तारै बोल्नुहोस्", tr: "bistaarai bolnuhos" }
];
