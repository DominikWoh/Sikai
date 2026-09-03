// Lektion 1 – Basis: Begrüßen, danken, erste Sätze
// Schema je Item: id, ne (Devanagari), tr (Umschrift), de (Deutsch), en (Englisch), note?/noteEn? (Hinweis)
window.LESSONS = [{
  id: "l1",
  level: "A0 · Basislektion",
  levelEn: "A0 · Foundation lesson",
  title: "नमस्ते",
  titleTr: "Namaste",
  subtitle: "Begrüßen, danken und die ersten Sätze",
  subtitleEn: "Greeting, thanking and your first sentences",
  est: "≈ 15 Minuten",
  estEn: "≈ 15 minutes",
  groups: [
    {
      id: "g1",
      title: "Begrüßung & Abschied",
      titleEn: "Greetings & Farewells",
      items: [
        { id: "l1_01", ne: "नमस्ते", tr: "namaste", de: "Hallo", en: "Hello",
          note: "wörtl.: „Ich verbeuge mich vor dir“ – passt immer, formell wie informell",
          noteEn: "lit.: “I bow to you” – always works, formal and informal" },
        { id: "l1_02", ne: "नमस्कार", tr: "namaskaar", de: "Guten Tag", en: "Good day",
          note: "ehrerbietiger als नमस्ते", noteEn: "more reverent than नमस्ते" },
        { id: "l1_03", ne: "शुभ प्रभात", tr: "shubha prabhaat", de: "Guten Morgen", en: "Good morning" },
        { id: "l1_04", ne: "शुभ रात्रि", tr: "shubha raatri", de: "Gute Nacht", en: "Good night" },
        { id: "l1_05", ne: "फेरि भेटौंला", tr: "pheri bhetaunlaa", de: "Auf Wiedersehen", en: "Goodbye",
          note: "wörtl.: „Mögen wir uns wiedersehen“", noteEn: "lit.: “may we meet again”" }
      ]
    },
    {
      id: "g2",
      title: "Danken & Höflichkeit",
      titleEn: "Thanking & Politeness",
      items: [
        { id: "l1_06", ne: "धन्यवाद", tr: "dhanyabaad", de: "Danke", en: "Thank you" },
        { id: "l1_07", ne: "धेरै धन्यवाद", tr: "dherai dhanyabaad", de: "Vielen Dank", en: "Thank you very much" },
        { id: "l1_08", ne: "कृपया", tr: "kripya", de: "bitte", en: "please" },
        { id: "l1_09", ne: "माफ गर्नुहोस्", tr: "maaf garnuhos", de: "Entschuldigung", en: "Excuse me / sorry",
          note: "wörtl.: „bitte verzeihen Sie“ – auch, um durchzukommen",
          noteEn: "lit.: “please forgive me” – also used to squeeze past people" },
        { id: "l1_10", ne: "स्वागत छ", tr: "swaagat chha", de: "Willkommen", en: "Welcome" }
      ]
    },
    {
      id: "g3",
      title: "Erste Sätze",
      titleEn: "First Sentences",
      items: [
        { id: "l1_11", ne: "तपाईंलाई कस्तो छ?", tr: "tapaainlaai kasto chha?", de: "Wie geht es Ihnen?", en: "How are you? (polite)" },
        { id: "l1_12", ne: "म ठीक छु।", tr: "ma thik chhu.", de: "Mir geht es gut.", en: "I am fine." },
        { id: "l1_13", ne: "मेरो नाम माया हो।", tr: "mero naam Maaya ho.", de: "Mein Name ist Maya.", en: "My name is Maya.",
          note: "Mit eigenem Namen: मेरो नाम ___ हो", noteEn: "With your own name: मेरो नाम ___ हो (mero naam ___ ho)" },
        { id: "l1_14", ne: "तपाईंको नाम के हो?", tr: "tapaainko naam ke ho?", de: "Wie ist Ihr Name?", en: "What is your name? (polite)" },
        { id: "l1_15", ne: "म जर्मनीबाट आएको हुँ।", tr: "ma Jarmanibaata aaeko hun.", de: "Ich komme aus Deutschland.", en: "I come from Germany.",
          note: "Sprecher männlich – weiblich: आएकी हुँ (aeki hun)",
          noteEn: "male speaker – female: आएकी हुँ (aeki hun); from elsewhere: your country + बाट" }
      ]
    },
    {
      id: "g4",
      title: "Im Gespräch",
      titleEn: "In Conversation",
      items: [
        { id: "l1_16", ne: "बिस्तारै बोल्नुहोस्", tr: "bistaarai bolnuhos", de: "Sprechen Sie bitte langsamer", en: "Please speak more slowly",
          note: "überlebenswichtig, wenn Nepali zu schnell wird",
          noteEn: "a lifesaver when Nepali gets too fast" },
        { id: "l1_17", ne: "मैले बुझिनँ।", tr: "maile bujhina.", de: "Ich habe nicht verstanden.", en: "I didn't understand." },
        { id: "l1_18", ne: "हो", tr: "ho", de: "ja", en: "yes" },
        { id: "l1_19", ne: "होइन", tr: "hoina", de: "nein", en: "no" },
        { id: "l1_20", ne: "राम्रो", tr: "raamro", de: "gut, schön", en: "good, nice" }
      ]
    },
    { id: "g5", title: "Zahlen & Zählen", titleEn: "Numbers & Counting", unlock: "thamel", items: [
      { id: "l2_01", ne: "एक", tr: "ek", de: "eins", en: "one" },
      { id: "l2_02", ne: "दुई", tr: "dui", de: "zwei", en: "two" },
      { id: "l2_03", ne: "तीन", tr: "tin", de: "drei", en: "three" },
      { id: "l2_04", ne: "चार", tr: "chaar", de: "vier", en: "four" },
      { id: "l2_05", ne: "पाँच", tr: "paanch", de: "fünf", en: "five" },
      { id: "l2_06", ne: "छ", tr: "chha", de: "sechs", en: "six",
        note: "klingt wie „tscha“ – nicht verwechseln mit छ (ist) in Sätzen",
        noteEn: "sounds like the ‘cha’ in cha-cha – don't confuse with छ (is) inside sentences" },
      { id: "l2_07", ne: "सात", tr: "saata", de: "sieben", en: "seven" },
      { id: "l2_08", ne: "आठ", tr: "aath", de: "acht", en: "eight" },
      { id: "l2_09", ne: "नौ", tr: "nau", de: "neun", en: "nine" },
      { id: "l2_10", ne: "दस", tr: "das", de: "zehn", en: "ten" },
      { id: "l2_11", ne: "सय", tr: "saya", de: "hundert", en: "hundred",
        note: "100 Rupien? „ek saya rupiya“ – für Preise das wichtigste Zahlwort",
        noteEn: "100 rupees? “ek saya rupiya” – the key number word for prices" }
    ]},
    { id: "g6", title: "Essen & Trinken", titleEn: "Food & Drink", unlock: "swayambhu", items: [
      { id: "l3_01", ne: "खाना", tr: "khaana", de: "Essen", en: "food" },
      { id: "l3_02", ne: "पानी", tr: "paani", de: "Wasser", en: "water" },
      { id: "l3_03", ne: "चिया", tr: "chiya", de: "Tee (mit Milch)", en: "tea (with milk)" },
      { id: "l3_04", ne: "भात", tr: "bhaat", de: "Reis", en: "rice" },
      { id: "l3_05", ne: "दाल", tr: "daal", de: "Linsensuppe", en: "lentil soup",
        note: "zusammen mit भात: das nationale Dal Bhat", noteEn: "together with भात: the national Dal Bhat" },
      { id: "l3_06", ne: "तरकारी", tr: "tarakaari", de: "Gemüse", en: "vegetables" },
      { id: "l3_07", ne: "कुखुरा", tr: "kukhuraa", de: "Huhn", en: "chicken" },
      { id: "l3_08", ne: "मीठो", tr: "mitho", de: "lecker", en: "delicious" },
      { id: "l3_09", ne: "भोक लाग्यो", tr: "bhok laagyo", de: "Ich habe Hunger", en: "I am hungry" },
      { id: "l3_10", ne: "गरम", tr: "garam", de: "heiß", en: "hot" }
    ]},
    { id: "g7", title: "Reisen & Wege", titleEn: "Travel & Directions", unlock: "bhaktapur", items: [
      { id: "l4_01", ne: "बस", tr: "bas", de: "Bus", en: "bus" },
      { id: "l4_02", ne: "जानुहोस्", tr: "jaanuhos", de: "Gehen Sie!", en: "Go! (polite)",
        note: "Höflichkeitsform – wie bei नमस्ते die -uhos-Endung",
        noteEn: "polite form – the -uhos- ending, as in नमस्ते-style politeness" },
      { id: "l4_03", ne: "आउनुहोस्", tr: "aaunuhos", de: "Kommen Sie!", en: "Come! (polite)" },
      { id: "l4_04", ne: "कता?", tr: "kata?", de: "wohin?", en: "where to?" },
      { id: "l4_05", ne: "सिधा", tr: "sidha", de: "geradeaus", en: "straight ahead" },
      { id: "l4_06", ne: "दायाँ", tr: "daayaa", de: "rechts", en: "right" },
      { id: "l4_07", ne: "बायाँ", tr: "baayaa", de: "links", en: "left" },
      { id: "l4_08", ne: "टाढा", tr: "taadhaa", de: "weit", en: "far" },
      { id: "l4_09", ne: "नजिक", tr: "najik", de: "nah", en: "near" },
      { id: "l4_10", ne: "कति पैसा?", tr: "kati paisa?", de: "Wie viel (Geld)?", en: "How much (money)?" },
      { id: "l4_11", ne: "उत्तर", tr: "uttar", de: "Norden", en: "north" },
      { id: "l4_12", ne: "दक्षिण", tr: "dakshin", de: "Süden", en: "south" },
      { id: "l4_13", ne: "पूर्व", tr: "purba", de: "Osten", en: "east",
        note: "der Sonnenaufgangsseite – Nagarkot-Frühstück mit Blick",
        noteEn: "the sunrise side – breakfast in Nagarkot faces it" },
      { id: "l4_14", ne: "पश्चिम", tr: "paschim", de: "Westen", en: "west" }
    ]},
    { id: "g8", title: "Trekking & Natur", titleEn: "Trekking & Nature", unlock: "nagarkot", items: [
      { id: "l5_01", ne: "हिमाल", tr: "himaal", de: "Himalaya, Schneeberg", en: "Himalaya, snow mountain" },
      { id: "l5_02", ne: "पहाड", tr: "pahaad", de: "Berg, Hügel", en: "mountain, hill" },
      { id: "l5_03", ne: "चिसो", tr: "chiso", de: "kalt", en: "cold" },
      { id: "l5_04", ne: "जङ्गल", tr: "jangal", de: "Dschungel, Wald", en: "jungle, forest" },
      { id: "l5_05", ne: "नदी", tr: "nadi", de: "Fluss", en: "river" },
      { id: "l5_06", ne: "सूर्य", tr: "surya", de: "Sonne", en: "sun" },
      { id: "l5_07", ne: "रात", tr: "raat", de: "Nacht", en: "night" },
      { id: "l5_08", ne: "बाटो", tr: "baato", de: "Weg", en: "path, road" },
      { id: "l5_09", ne: "झोला", tr: "jholaa", de: "Tasche, Rucksack", en: "bag, backpack" },
      { id: "l5_10", ne: "चरा", tr: "chara", de: "Vogel", en: "bird" }
    ]},
    { id: "g9", title: "Basis-Wortschatz", titleEn: "Core Vocabulary", unlock: "pokhara", items: [
      { id: "l6_01", ne: "सानो", tr: "saano", de: "klein", en: "small" },
      { id: "l6_02", ne: "ठूलो", tr: "thulo", de: "groß", en: "big" },
      { id: "l6_03", ne: "यहाँ", tr: "yahaa", de: "hier", en: "here" },
      { id: "l6_04", ne: "त्यहाँ", tr: "tyahaa", de: "dort", en: "there" },
      { id: "l6_05", ne: "थाहा छैन", tr: "thaaha chhaina", de: "Ich weiß nicht", en: "I don't know" },
      { id: "l6_06", ne: "मद्दत", tr: "maddat", de: "Hilfe", en: "help" },
      { id: "l6_07", ne: "पक्का", tr: "pakka", de: "sicher, ganz gewiss", en: "for sure, certain",
        note: "„Pakka!“ – das nepalesische Versprechen schlechthin",
        noteEn: "“Pakka!” – the Nepali promise of all promises" },
      { id: "l6_08", ne: "अब", tr: "ab", de: "jetzt", en: "now" },
      { id: "l6_09", ne: "घर", tr: "ghar", de: "Haus, Zuhause", en: "house, home" },
      { id: "l6_10", ne: "मान्छे", tr: "maanchhe", de: "Mensch", en: "person" }
    ]},
    { id: "g10", title: "Notfall & Hilfe", titleEn: "Emergency & Help", unlock: "swayambhu", items: [
      { id: "l7_01", ne: "प्रहरी", tr: "prahari", de: "Polizei", en: "police" },
      { id: "l7_02", ne: "म हराएँ।", tr: "ma haraaen.", de: "Ich habe mich verlaufen.", en: "I am lost." },
      { id: "l7_03", ne: "मलाई डाक्टर चाहियो।", tr: "malaai doctor chahiyo.", de: "Ich brauche einen Arzt.", en: "I need a doctor." },
      { id: "l7_04", ne: "अस्पताल", tr: "aspatal", de: "Krankenhaus", en: "hospital" },
      { id: "l7_05", ne: "दुख्छ", tr: "dukhchha", de: "es tut weh", en: "it hurts" },
      { id: "l7_06", ne: "टाउको", tr: "taauko", de: "Kopf", en: "head" },
      { id: "l7_07", ne: "खुट्टा", tr: "khuttaa", de: "Bein, Fuß", en: "leg, foot" },
      { id: "l7_08", ne: "हात", tr: "haat", de: "Hand", en: "hand" },
      { id: "l7_09", ne: "सावधान!", tr: "saavadhaan!", de: "Vorsicht!", en: "Careful!" },
      { id: "l7_10", ne: "ठीक हुन्छ", tr: "thik hunchha", de: "Es wird wieder gut", en: "It will be okay",
        note: "das nepalesische Aufmunterungs-Wort – bei jeder Wehwehchen",
        noteEn: "the Nepali word of comfort – for every little ache" },
      { id: "l7_11", ne: "मद्दत गर्नुहोस्!", tr: "maddat garnuhos!", de: "Helfen Sie mir!", en: "Help me! (polite)",
        note: "DER Notfall-Ruf – laut und deutlich rufen",
        noteEn: "THE emergency call – shout it loud and clear" }
    ]},
    { id: "g11", title: "Wichtige Sätze", titleEn: "Key Sentences", unlock: "bhaktapur", items: [
      { id: "l8_01", ne: "मलाई पानी चाहियो।", tr: "malaai paani chahiyo.", de: "Ich brauche Wasser.", en: "I need water.",
        note: "Das Muster schlechthin: मलाई … चाहियो = „Ich brauche …“ – einfach das Wort einschieben",
        noteEn: "The pattern of patterns: मलाई … चाहियो = “I need …” – just slot the word in" },
      { id: "l8_02", ne: "यो कति पर्छ?", tr: "yo kati parchha?", de: "Wie viel kostet das?", en: "How much does this cost?" },
      { id: "l8_03", ne: "एकदम महँगो भयो!", tr: "ekdam mahango bhayo!", de: "Das ist viel zu teuer!", en: "That's way too expensive!",
        note: "eröffnet jede Verhandlung – mit Lächeln", noteEn: "opens every negotiation – said with a smile" },
      { id: "l8_04", ne: "ठीक छ, म यो लिन्छु।", tr: "thik chha, ma yo linchhu.", de: "Okay, ich nehme es.", en: "Okay, I'll take it." },
      { id: "l8_05", ne: "शौचालय कहाँ छ?", tr: "sauchalaya kaha chha?", de: "Wo ist die Toilette?", en: "Where is the toilet?",
        note: "कहाँ छ …? = „Wo ist …?“ – funktioniert mit jedem Wort",
        noteEn: "कहाँ छ …? = “Where is …?” – works with any word" },
      { id: "l8_06", ne: "फेरि भन्नुहोस्।", tr: "pheri bhannuhos.", de: "Sagen Sie es noch einmal.", en: "Please say that again." },
      { id: "l8_07", ne: "कुन बेला?", tr: "kun bela?", de: "Wann? Um wie viel Uhr?", en: "When? At what time?" },
      { id: "l8_08", ne: "आज", tr: "aaja", de: "heute", en: "today" },
      { id: "l8_09", ne: "भोलि", tr: "bholi", de: "morgen", en: "tomorrow" },
      { id: "l8_10", ne: "मासु खान्दिनँ।", tr: "maasu khaandina.", de: "Ich esse kein Fleisch.", en: "I don't eat meat." },
      { id: "l8_11", ne: "मलाई थमेल लानुहोस्।", tr: "malaai Thamel laanuhos.", de: "Bringen Sie mich nach Thamel.", en: "Take me to Thamel.",
        note: "मलाई … लानुहोस् = „bringen Sie mich nach …“ – das Taxi-Muster (wie in der Story)",
        noteEn: "मलाई … लानुहोस् = “take me to …” – the taxi pattern (as in the story)" },
      { id: "l8_12", ne: "बस कुन बेला जान्छ?", tr: "bas kun bela jaanchha?", de: "Wann fährt der Bus?", en: "When does the bus leave?" }
    ]},
    { id: "g12", title: "Ankunft: Flughafen, Taxi & Hotel", titleEn: "Arrival: Airport, Taxi & Hotel", storyOnly: true, items: [
      { id: "l9_01", ne: "विमानस्थल", tr: "bimaanasthal", de: "Flughafen", en: "airport" },
      { id: "l9_02", ne: "निस्कने ढोका कहाँ हो?", tr: "niskane dhaakaa kaha ho?", de: "Wo ist der Ausgang?", en: "Where is the exit?" },
      { id: "l9_03", ne: "कति बजे?", tr: "kati baje?", de: "Wie spät ist es?", en: "What time is it?" },
      { id: "l9_04", ne: "रुपैयाँ", tr: "rupaiya", de: "Rupie (Geld)", en: "rupee (money)" },
      { id: "l9_05", ne: "पैसा फेर्ने ठाउँ कहाँ छ?", tr: "paisa pherne thau kaha chha?", de: "Wo kann man Geld wechseln?", en: "Where can I exchange money?" },
      { id: "l9_06", ne: "ट्याक्सी कहाँ छ?", tr: "tyaksi kaha chha?", de: "Wo ist ein Taxi?", en: "Where is a taxi?" },
      { id: "l9_07", ne: "कहाँबाट?", tr: "kahaabaata?", de: "woher?", en: "from where?" },
      { id: "l9_08", ne: "होटल", tr: "hotal", de: "Hotel", en: "hotel" },
      { id: "l9_09", ne: "कोठा", tr: "kotha", de: "Zimmer", en: "room" },
      { id: "l9_10", ne: "एउटा कोठा चाहियो।", tr: "eutaa kotha chahiyo.", de: "Ich brauche ein Zimmer.", en: "I need a room.",
        note: "मलाई … चाहियो mit एउटा (ein) davor – das Hotel-Muster",
        noteEn: "मलाई … चाहियो with एउटा (one) in front – the hotel pattern" },
      { id: "l9_11", ne: "बुक गरेको छु।", tr: "buk gareko chhu.", de: "Ich habe reserviert.", en: "I have a reservation.",
        note: "„buk“ = englisches book – Nepali liehnt sich solche Wörter",
        noteEn: "“buk” = the English word book – Nepali borrows such words" }
    ]},
    { id: "g13", title: "In Thamel: Café & Basar", titleEn: "In Thamel: Café & Bazaar", storyOnly: true, items: [
      { id: "l10_01", ne: "चिया दिनुहोस्।", tr: "chiya dinuhos.", de: "Tee, bitte.", en: "Tea, please.",
        note: "… दिनुहोस् = „geben Sie mir bitte …“ – das Bestell-Muster",
        noteEn: "… दिनुहोस् = “please give me …” – the ordering pattern" },
      { id: "l10_02", ne: "पानी दिनुहोस्।", tr: "paani dinuhos.", de: "Wasser, bitte.", en: "Water, please." },
      { id: "l10_03", ne: "मीठो छ!", tr: "mitho chha!", de: "Lecker!", en: "Delicious!" },
      { id: "l10_04", ne: "बिल दिनुहोस्।", tr: "bila dinuhos.", de: "Die Rechnung, bitte.", en: "The bill, please.",
        note: "„bila“ = englisch bill", noteEn: "“bila” = the English word bill" },
      { id: "l10_05", ne: "म यहाँ बस्छु।", tr: "ma yahaa baschhu.", de: "Ich wohne hier.", en: "I live here / I'm staying here." },
      { id: "l10_06", ne: "बजार", tr: "bajaar", de: "Basar, Markt", en: "bazaar, market" },
      { id: "l10_07", ne: "पैसा", tr: "paisa", de: "Geld", en: "money" }
    ]},
    { id: "g14", title: "Am Tempel: Swayambhu", titleEn: "At the Temple: Swayambhu", storyOnly: true, items: [
      { id: "l11_01", ne: "मन्दिर", tr: "mandir", de: "Tempel", en: "temple" },
      { id: "l11_02", ne: "बानर", tr: "baanar", de: "Affe", en: "monkey" },
      { id: "l11_03", ne: "शहर", tr: "shahar", de: "Stadt", en: "city" },
      { id: "l11_04", ne: "फेरि", tr: "pheri", de: "wieder", en: "again",
        note: "kennst du schon aus फेरि भेटौंला – „auf Wiedersehen“",
        noteEn: "you already know it from फेरि भेटौंला – “goodbye”" },
      { id: "l11_05", ne: "शान्त", tr: "shaanta", de: "ruhig", en: "peaceful, calm" },
      { id: "l11_06", ne: "देख्नुहोस्!", tr: "dekhnuhos!", de: "Schauen Sie!", en: "Look! (polite)",
        note: "wie जानुहोस् (gehen Sie) – die höfliche Bitte-Form",
        noteEn: "like जानुहोस् (go) – the polite request form" },
      { id: "l11_07", ne: "ढुङ्गा", tr: "dhunga", de: "Stein", en: "stone" }
    ]},
    { id: "g15", title: "Bhaktapur: die rote Stadt", titleEn: "Bhaktapur: the Red City", storyOnly: true, items: [
      { id: "l12_01", ne: "गाउँ", tr: "gaaun", de: "Dorf, Städtchen", en: "village, small town" },
      { id: "l12_02", ne: "ढोका", tr: "dhaakaa", de: "Tor", en: "gate",
        note: "wie in निस्कने ढोका – der Ausgang", noteEn: "as in निस्कने ढोका – the exit" },
      { id: "l12_03", ne: "पुरानो", tr: "puraano", de: "alt", en: "old" },
      { id: "l12_04", ne: "माटो", tr: "maato", de: "Ton, Erde", en: "clay, earth" },
      { id: "l12_05", ne: "बिहान", tr: "bihana", de: "Morgen", en: "morning" },
      { id: "l12_06", ne: "बेलुका", tr: "beluka", de: "Abend", en: "evening" },
      { id: "l12_07", ne: "खुशी", tr: "khushi", de: "Freude, Glück", en: "joy, happiness" }
    ]},
    { id: "g16", title: "Nagarkot: Sonnenaufgang", titleEn: "Nagarkot: Sunrise", storyOnly: true, items: [
      { id: "l13_01", ne: "छिटो", tr: "chhito", de: "schnell", en: "fast, quick" },
      { id: "l13_02", ne: "ढिलो", tr: "dhilo", de: "langsam, spät", en: "slow, late" },
      { id: "l13_03", ne: "बादल", tr: "baadal", de: "Wolke", en: "cloud" },
      { id: "l13_04", ne: "आकाश", tr: "aakaash", de: "Himmel", en: "sky" },
      { id: "l13_05", ne: "सुन्दर", tr: "sundar", de: "wunderschön", en: "beautiful" }
    ]},
    { id: "g17", title: "Pokhara: Am See", titleEn: "Pokhara: By the Lake", storyOnly: true, items: [
      { id: "l14_01", ne: "ताल", tr: "taal", de: "See", en: "lake" },
      { id: "l14_02", ne: "डुङ्गा", tr: "dungaa", de: "Boot", en: "boat" },
      { id: "l14_03", ne: "माछा", tr: "maachha", de: "Fisch", en: "fish" },
      { id: "l14_04", ne: "आराम", tr: "aaraam", de: "Ruhe, Erholung", en: "rest, relaxation" }
    ]},
    { id: "g18", title: "Lumbini: Der Garten", titleEn: "Lumbini: The Garden", storyOnly: true, items: [
      { id: "l15_01", ne: "फूल", tr: "phool", de: "Blume", en: "flower" },
      { id: "l15_02", ne: "रूख", tr: "ruukh", de: "Baum", en: "tree" },
      { id: "l15_03", ne: "ध्यान", tr: "dhyaan", de: "Meditation, Stille", en: "meditation, stillness" },
      { id: "l15_04", ne: "बुद्ध", tr: "buddha", de: "Buddha", en: "Buddha" }
    ]},
    { id: "g19", title: "Chitwan: Im Dschungel", titleEn: "Chitwan: In the Jungle", storyOnly: true, items: [
      { id: "l16_01", ne: "हात्ती", tr: "haatti", de: "Elefant", en: "elephant" },
      { id: "l16_02", ne: "बाघ", tr: "baagh", de: "Tiger", en: "tiger" },
      { id: "l16_03", ne: "जनावर", tr: "janaawar", de: "Tier", en: "animal" },
      { id: "l16_04", ne: "आगो", tr: "aago", de: "Feuer", en: "fire" }
    ]},
    { id: "g20", title: "Everest: Das Dach der Welt", titleEn: "Everest: Roof of the World", storyOnly: true, items: [
      { id: "l17_01", ne: "हिउँ", tr: "hiun", de: "Schnee", en: "snow" },
      { id: "l17_02", ne: "खोला", tr: "kholaa", de: "Bach", en: "stream" },
      { id: "l17_03", ne: "झन्डा", tr: "jhandaa", de: "Fahne", en: "flag" },
      { id: "l17_04", ne: "नेपाल", tr: "Nepaal", de: "Nepal", en: "Nepal" }
    ]},
    { id: "g21", title: "Basis: Fragen, Verben & Gefühle", titleEn: "Basics: Questions, Verbs & Feelings", items: [
      { id: "l18_01", ne: "किन?", tr: "kina?", de: "Warum?", en: "Why?" },
      { id: "l18_02", ne: "को?", tr: "ko?", de: "Wer?", en: "Who?" },
      { id: "l18_03", ne: "हिजो", tr: "hijo", de: "gestern", en: "yesterday" },
      { id: "l18_04", ne: "दिउँसो", tr: "diuso", de: "Nachmittag", en: "afternoon" },
      { id: "l18_05", ne: "सुत्नु", tr: "sutnu", de: "schlafen", en: "to sleep" },
      { id: "l18_06", ne: "पिउनु", tr: "piunu", de: "trinken", en: "to drink",
        note: "kennst du von पिउनुहोस् – trinken Sie", noteEn: "you know it from पिउनुहोस् – please drink" },
      { id: "l18_07", ne: "पकाउनु", tr: "pakaunu", de: "kochen", en: "to cook" },
      { id: "l18_08", ne: "खुसी", tr: "khusi", de: "glücklich", en: "happy" },
      { id: "l18_09", ne: "दुखी", tr: "dukhi", de: "traurig", en: "sad" },
      { id: "l18_10", ne: "नराम्रो", tr: "naraamro", de: "nicht schön, schlecht", en: "not good, bad",
        note: "das Gegenteil von राम्रो (raamro = gut)", noteEn: "the opposite of राम्रो (raamro = good)" },
      { id: "l18_11", ne: "साथी", tr: "saathi", de: "Freund", en: "friend" }
    ]}
  ]
}];

// Bausteine für Satz-Bau-Übungen (ids verweisen auf items oben)
window.BUILD_SENTENCES = ["l1_13", "l1_12", "l1_11", "l8_01", "l8_02", "l8_04"];

window.COMING = [
  { title: "एक, दुई, तीन", titleTr: "Ek, dui, tin", subtitle: "Zahlen & einfache Fragen", subtitleEn: "Numbers & simple questions" },
  { title: "यो के हो?", titleTr: "Yo ke ho?", subtitle: "Dinge benennen & Fragen stellen", subtitleEn: "Naming things & asking questions" }
];
