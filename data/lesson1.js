// Lektion 1 – Basis: Begrüßen, danken, erste Sätze
// Schema je Item: id, ne (Devanagari), tr (Umschrift), de (Deutsch), note? (Hinweis)
window.LESSONS = [{
  id: "l1",
  level: "A0 · Basislektion",
  title: "नमस्ते",
  titleTr: "Namaste",
  subtitle: "Begrüßen, danken und die ersten Sätze",
  est: "≈ 15 Minuten",
  groups: [
    {
      id: "g1",
      title: "Begrüßung & Abschied",
      items: [
        { id: "l1_01", ne: "नमस्ते", tr: "namaste", de: "Hallo",
          note: "wörtl.: „Ich verbeuge mich vor dir“ – passt immer, formell wie informell" },
        { id: "l1_02", ne: "नमस्कार", tr: "namaskaar", de: "Guten Tag",
          note: "ehrerbietiger als नमस्ते" },
        { id: "l1_03", ne: "शुभ प्रभात", tr: "shubha prabhaat", de: "Guten Morgen" },
        { id: "l1_04", ne: "शुभ रात्रि", tr: "shubha raatri", de: "Gute Nacht" },
        { id: "l1_05", ne: "फेरि भेटौंला", tr: "pheri bhetaunlaa", de: "Auf Wiedersehen",
          note: "wörtl.: „Mögen wir uns wiedersehen“" }
      ]
    },
    {
      id: "g2",
      title: "Danken & Höflichkeit",
      items: [
        { id: "l1_06", ne: "धन्यवाद", tr: "dhanyabaad", de: "Danke" },
        { id: "l1_07", ne: "धेरै धन्यवाद", tr: "dherai dhanyabaad", de: "Vielen Dank" },
        { id: "l1_08", ne: "कृपया", tr: "kripya", de: "bitte" },
        { id: "l1_09", ne: "माफ गर्नुहोस्", tr: "maaf garnuhos", de: "Entschuldigung",
          note: "wörtl.: „bitte verzeihen Sie“ – auch, um durchzukommen" },
        { id: "l1_10", ne: "स्वागत छ", tr: "swaagat chha", de: "Willkommen" }
      ]
    },
    {
      id: "g3",
      title: "Erste Sätze",
      items: [
        { id: "l1_11", ne: "तपाईंलाई कस्तो छ?", tr: "tapaainlaai kasto chha?", de: "Wie geht es Ihnen?" },
        { id: "l1_12", ne: "म ठीक छु।", tr: "ma thik chhu.", de: "Mir geht es gut." },
        { id: "l1_13", ne: "मेरो नाम माया हो।", tr: "mero naam Maaya ho.", de: "Mein Name ist Maya.",
          note: "Mit eigenem Namen: मेरो नाम ___ हो" },
        { id: "l1_14", ne: "तपाईंको नाम के हो?", tr: "tapaainko naam ke ho?", de: "Wie ist Ihr Name?" },
        { id: "l1_15", ne: "म जर्मनीबाट आएको हुँ।", tr: "ma Jarmanibaata aaeko hun.", de: "Ich komme aus Deutschland.",
          note: "Sprecher männlich – weiblich: आएकी हुँ (aeki hun)" }
      ]
    },
    {
      id: "g4",
      title: "Im Gespräch",
      items: [
        { id: "l1_16", ne: "बिस्तारै बोल्नुहोस्", tr: "bistaarai bolnuhos", de: "Sprechen Sie bitte langsamer",
          note: "überlebenswichtig, wenn Nepali zu schnell wird" },
        { id: "l1_17", ne: "मैले बुझिनँ।", tr: "maile bujhina.", de: "Ich habe nicht verstanden." },
        { id: "l1_18", ne: "हो", tr: "ho", de: "ja" },
        { id: "l1_19", ne: "होइन", tr: "hoina", de: "nein" },
        { id: "l1_20", ne: "राम्रो", tr: "raamro", de: "gut, schön" }
      ]
    },
    { id: "g5", title: "Zahlen & Zählen", unlock: "thamel", items: [
      { id: "l2_01", ne: "एक", tr: "ek", de: "eins" },
      { id: "l2_02", ne: "दुई", tr: "dui", de: "zwei" },
      { id: "l2_03", ne: "तीन", tr: "tin", de: "drei" },
      { id: "l2_04", ne: "चार", tr: "chaar", de: "vier" },
      { id: "l2_05", ne: "पाँच", tr: "paanch", de: "fünf" },
      { id: "l2_06", ne: "छ", tr: "chha", de: "sechs", note: "klingt wie „tscha“ – nicht verwechseln mit छ (ist) in Sätzen" },
      { id: "l2_07", ne: "सात", tr: "saata", de: "sieben" },
      { id: "l2_08", ne: "आठ", tr: "aath", de: "acht" },
      { id: "l2_09", ne: "नौ", tr: "nau", de: "neun" },
      { id: "l2_10", ne: "दस", tr: "das", de: "zehn" },
      { id: "l2_11", ne: "सय", tr: "saya", de: "hundert", note: "100 Rupien? „ek saya rupiya“ – für Preise das wichtigste Zahlwort" }
    ]},
    { id: "g6", title: "Essen & Trinken", unlock: "swayambhu", items: [
      { id: "l3_01", ne: "खाना", tr: "khaana", de: "Essen" },
      { id: "l3_02", ne: "पानी", tr: "paani", de: "Wasser" },
      { id: "l3_03", ne: "चिया", tr: "chiya", de: "Tee (mit Milch)" },
      { id: "l3_04", ne: "भात", tr: "bhaat", de: "Reis" },
      { id: "l3_05", ne: "दाल", tr: "daal", de: "Linsensuppe", note: "zusammen mit भात: das nationale Dal Bhat" },
      { id: "l3_06", ne: "तरकारी", tr: "tarakaari", de: "Gemüse" },
      { id: "l3_07", ne: "कुखुरा", tr: "kukhuraa", de: "Huhn" },
      { id: "l3_08", ne: "मीठो", tr: "mitho", de: "lecker" },
      { id: "l3_09", ne: "भोक लाग्यो", tr: "bhok laagyo", de: "Ich habe Hunger" },
      { id: "l3_10", ne: "गरम", tr: "garam", de: "heiß" }
    ]},
    { id: "g7", title: "Reisen & Wege", unlock: "bhaktapur", items: [
      { id: "l4_01", ne: "बस", tr: "bas", de: "Bus" },
      { id: "l4_02", ne: "जानुहोस्", tr: "jaanuhos", de: "Gehen Sie!", note: "Höflichkeitsform – wie bei नमस्ते die -uhos-Endung" },
      { id: "l4_03", ne: "आउनुहोस्", tr: "aaunuhos", de: "Kommen Sie!" },
      { id: "l4_04", ne: "कता?", tr: "kata?", de: "wohin?" },
      { id: "l4_05", ne: "सिधा", tr: "sidha", de: "geradeaus" },
      { id: "l4_06", ne: "दायाँ", tr: "daayaa", de: "rechts" },
      { id: "l4_07", ne: "बायाँ", tr: "baayaa", de: "links" },
      { id: "l4_08", ne: "टाढा", tr: "taadhaa", de: "weit" },
      { id: "l4_09", ne: "नजिक", tr: "najik", de: "nah" },
      { id: "l4_10", ne: "कति पैसा?", tr: "kati paisa?", de: "Wie viel (Geld)?" },
      { id: "l4_11", ne: "उत्तर", tr: "uttar", de: "norden" },
      { id: "l4_12", ne: "दक्षिण", tr: "dakshin", de: "süden" },
      { id: "l4_13", ne: "पूर्व", tr: "purba", de: "osten", note: "der Sonnenaufgangsseite – Nagarkart-Frühstück mit Blick" },
      { id: "l4_14", ne: "पश्चिम", tr: "paschim", de: "westen" }
    ]},
    { id: "g8", title: "Trekking & Natur", unlock: "nagarkot", items: [
      { id: "l5_01", ne: "हिमाल", tr: "himaal", de: "Himalaya, Schneeberg" },
      { id: "l5_02", ne: "पहाड", tr: "pahaad", de: "Berg, Hügel" },
      { id: "l5_03", ne: "चिसो", tr: "chiso", de: "kalt" },
      { id: "l5_04", ne: "जङ्गल", tr: "jangal", de: "Dschungel, Wald" },
      { id: "l5_05", ne: "नदी", tr: "nadi", de: "Fluss" },
      { id: "l5_06", ne: "सूर्य", tr: "surya", de: "Sonne" },
      { id: "l5_07", ne: "रात", tr: "raat", de: "Nacht" },
      { id: "l5_08", ne: "बाटो", tr: "baato", de: "Weg" },
      { id: "l5_09", ne: "झोला", tr: "jholaa", de: "Tasche, Rucksack" },
      { id: "l5_10", ne: "चरा", tr: "chara", de: "Vogel" }
    ]},
    { id: "g9", title: "Basis-Wortschatz", unlock: "pokhara", items: [
      { id: "l6_01", ne: "सानो", tr: "saano", de: "klein" },
      { id: "l6_02", ne: "ठूलो", tr: "thulo", de: "groß" },
      { id: "l6_03", ne: "यहाँ", tr: "yahaa", de: "hier" },
      { id: "l6_04", ne: "त्यहाँ", tr: "tyahaa", de: "dort" },
      { id: "l6_05", ne: "थाहा छैन", tr: "thaaha chhaina", de: "Ich weiß nicht" },
      { id: "l6_06", ne: "मद्दत", tr: "maddat", de: "Hilfe" },
      { id: "l6_07", ne: "पक्का", tr: "pakka", de: "sicher, ganz gewiss", note: "„Pakka!“ – das nepalesische Versprechen schlechthin" },
      { id: "l6_08", ne: "अब", tr: "ab", de: "jetzt" },
      { id: "l6_09", ne: "घर", tr: "ghar", de: "Haus, Zuhause" },
      { id: "l6_10", ne: "मान्छे", tr: "maanchhe", de: "Mensch" }
    ]},
    { id: "g10", title: "Notfall & Hilfe", unlock: "swayambhu", items: [
      { id: "l7_01", ne: "प्रहरी", tr: "prahari", de: "Polizei" },
      { id: "l7_02", ne: "म हराएँ।", tr: "ma haraaen.", de: "Ich habe mich verlaufen." },
      { id: "l7_03", ne: "मलाई डाक्टर चाहियो।", tr: "malaai doctor chahiyo.", de: "Ich brauche einen Arzt." },
      { id: "l7_04", ne: "अस्पताल", tr: "aspatal", de: "Krankenhaus" },
      { id: "l7_05", ne: "दुख्छ", tr: "dukhchha", de: "es tut weh" },
      { id: "l7_06", ne: "टाउको", tr: "taauko", de: "Kopf" },
      { id: "l7_07", ne: "खुट्टा", tr: "khuttaa", de: "Bein, Fuß" },
      { id: "l7_08", ne: "हात", tr: "haat", de: "Hand" },
      { id: "l7_09", ne: "सावधान!", tr: "saavadhaan!", de: "Vorsicht!" },
      { id: "l7_10", ne: "ठीक हुन्छ", tr: "thik hunchha", de: "Es wird wieder gut", note: "das nepalesische Aufmunterungs-Wort – bei jeder Wehwehchen" },
      { id: "l7_11", ne: "मद्दत गर्नुहोस्!", tr: "maddat garnuhos!", de: "Helfen Sie mir!", note: "DER Notfall-Ruf – laut und deutlich rufen" }
    ]},
    { id: "g11", title: "Wichtige Sätze", unlock: "bhaktapur", items: [
      { id: "l8_01", ne: "मलाई पानी चाहियो।", tr: "malaai paani chahiyo.", de: "Ich brauche Wasser.",
        note: "Das Muster schlechthin: मलाई … चाहियो = „Ich brauche …“ – einfach das Wort einschieben" },
      { id: "l8_02", ne: "यो कति पर्छ?", tr: "yo kati parchha?", de: "Wie viel kostet das?" },
      { id: "l8_03", ne: "एकदम महँगो भयो!", tr: "ekdam mahango bhayo!", de: "Das ist viel zu teuer!", note: "eröffnet jede Verhandlung – mit Lächeln" },
      { id: "l8_04", ne: "ठीक छ, म यो लिन्छु।", tr: "thik chha, ma yo linchhu.", de: "Okay, ich nehme es." },
      { id: "l8_05", ne: "शौचालय कहाँ छ?", tr: "sauchalaya kaha chha?", de: "Wo ist die Toilette?",
        note: "कहाँ छ …? = „Wo ist …?“ – funktioniert mit jedem Wort" },
      { id: "l8_06", ne: "फेरि भन्नुहोस्।", tr: "pheri bhannuhos.", de: "Sagen Sie es noch einmal." },
      { id: "l8_07", ne: "कुन बेला?", tr: "kun bela?", de: "Wann? Um wie viel Uhr?" },
      { id: "l8_08", ne: "आज", tr: "aaja", de: "heute" },
      { id: "l8_09", ne: "भोलि", tr: "bholi", de: "morgen" },
      { id: "l8_10", ne: "मासु खान्दिनँ।", tr: "maasu khaandina.", de: "Ich esse kein Fleisch." },
      { id: "l8_11", ne: "मलाई थमेल लानुहोस्।", tr: "malaai Thamel laanuhos.", de: "Bringen Sie mich nach Thamel.",
        note: "मलाई … लानुहोस् = „bringen Sie mich nach …“ – das Taxi-Muster (wie in der Story)" },
      { id: "l8_12", ne: "बस कुन बेला जान्छ?", tr: "bas kun bela jaanchha?", de: "Wann fährt der Bus?" }
    ]},
    { id: "g12", title: "Ankunft: Flughafen, Taxi & Hotel", storyOnly: true, items: [
      { id: "l9_01", ne: "विमानस्थल", tr: "bimaanasthal", de: "Flughafen" },
      { id: "l9_02", ne: "निस्कने ढोका कहाँ हो?", tr: "niskane dhaakaa kaha ho?", de: "Wo ist der Ausgang?" },
      { id: "l9_03", ne: "कति बजे?", tr: "kati baje?", de: "Wie spät ist es?" },
      { id: "l9_04", ne: "रुपैयाँ", tr: "rupaiya", de: "Rupie (Geld)" },
      { id: "l9_05", ne: "पैसा फेर्ने ठाउँ कहाँ छ?", tr: "paisa pherne thau kaha chha?", de: "Wo kann man Geld wechseln?" },
      { id: "l9_06", ne: "ट्याक्सी कहाँ छ?", tr: "tyaksi kaha chha?", de: "Wo ist ein Taxi?" },
      { id: "l9_07", ne: "कहाँबाट?", tr: "kahaabaata?", de: "woher?" },
      { id: "l9_08", ne: "होटल", tr: "hotal", de: "Hotel" },
      { id: "l9_09", ne: "कोठा", tr: "kotha", de: "Zimmer" },
      { id: "l9_10", ne: "एउटा कोठा चाहियो।", tr: "eutaa kotha chahiyo.", de: "Ich brauche ein Zimmer.",
        note: "मलाई … चाहियो mit एउटा (ein) davor – das Hotel-Muster" },
      { id: "l9_11", ne: "बुक गरेको छु।", tr: "buk gareko chhu.", de: "Ich habe reserviert.",
        note: "„buk“ = englisches book – Nepali liehnt sich solche Wörter" }
    ]},
    { id: "g13", title: "In Thamel: Café & Basar", storyOnly: true, items: [
      { id: "l10_01", ne: "चिया दिनुहोस्।", tr: "chiya dinuhos.", de: "Tee, bitte.",
        note: "… दिनुहोस् = „geben Sie mir bitte …“ – das Bestell-Muster" },
      { id: "l10_02", ne: "पानी दिनुहोस्।", tr: "paani dinuhos.", de: "Wasser, bitte." },
      { id: "l10_03", ne: "मीठो छ!", tr: "mitho chha!", de: "Lecker!" },
      { id: "l10_04", ne: "बिल दिनुहोस्।", tr: "bila dinuhos.", de: "Die Rechnung, bitte.",
        note: "„bila“ = englisch bill" },
      { id: "l10_05", ne: "म यहाँ बस्छु।", tr: "ma yahaa baschhu.", de: "Ich wohne hier." },
      { id: "l10_06", ne: "बजार", tr: "bajaar", de: "Basar, Markt" },
      { id: "l10_07", ne: "पैसा", tr: "paisa", de: "Geld" }
    ]},
    { id: "g14", title: "Am Tempel: Swayambhu", storyOnly: true, items: [
      { id: "l11_01", ne: "मन्दिर", tr: "mandir", de: "Tempel" },
      { id: "l11_02", ne: "बानर", tr: "baanar", de: "Affe" },
      { id: "l11_03", ne: "शहर", tr: "shahar", de: "Stadt" },
      { id: "l11_04", ne: "फेरि", tr: "pheri", de: "wieder",
        note: "kennst du schon aus फेरि भेटौंला – „auf Wiedersehen“" },
      { id: "l11_05", ne: "शान्त", tr: "shaanta", de: "ruhig" },
      { id: "l11_06", ne: "देख्नुहोस्!", tr: "dekhnuhos!", de: "Schauen Sie!",
        note: "wie जानुहोस् (gehen Sie) – die höfliche Bitte-Form" },
      { id: "l11_07", ne: "ढुङ्गा", tr: "dhunga", de: "Stein" }
    ]},
    { id: "g15", title: "Bhaktapur: die rote Stadt", storyOnly: true, items: [
      { id: "l12_01", ne: "गाउँ", tr: "gaaun", de: "Dorf, Städtchen" },
      { id: "l12_02", ne: "ढोका", tr: "dhaakaa", de: "Tor",
        note: "wie in निस्कने ढोका – der Ausgang" },
      { id: "l12_03", ne: "पुरानो", tr: "puraano", de: "alt" },
      { id: "l12_04", ne: "माटो", tr: "maato", de: "Ton, Erde" },
      { id: "l12_05", ne: "बिहान", tr: "bihana", de: "Morgen" },
      { id: "l12_06", ne: "बेलुका", tr: "beluka", de: "Abend" },
      { id: "l12_07", ne: "खुशी", tr: "khushi", de: "Freude, Glück" }
    ]},
    { id: "g16", title: "Nagarkot: Sonnenaufgang", storyOnly: true, items: [
      { id: "l13_01", ne: "छिटो", tr: "chhito", de: "schnell" },
      { id: "l13_02", ne: "ढिलो", tr: "dhilo", de: "langsam, spät" },
      { id: "l13_03", ne: "बादल", tr: "baadal", de: "Wolke" },
      { id: "l13_04", ne: "आकाश", tr: "aakaash", de: "Himmel" },
      { id: "l13_05", ne: "सुन्दर", tr: "sundar", de: "wunderschön" }
    ]},
    { id: "g17", title: "Pokhara: Am See", storyOnly: true, items: [
      { id: "l14_01", ne: "ताल", tr: "taal", de: "See" },
      { id: "l14_02", ne: "डुङ्गा", tr: "dungaa", de: "Boot" },
      { id: "l14_03", ne: "माछा", tr: "maachha", de: "Fisch" },
      { id: "l14_04", ne: "आराम", tr: "aaraam", de: "Ruhe, Erholung" }
    ]},
    { id: "g18", title: "Lumbini: Der Garten", storyOnly: true, items: [
      { id: "l15_01", ne: "फूल", tr: "phool", de: "Blume" },
      { id: "l15_02", ne: "रूख", tr: "ruukh", de: "Baum" },
      { id: "l15_03", ne: "ध्यान", tr: "dhyaan", de: "Meditation, Stille" },
      { id: "l15_04", ne: "बुद्ध", tr: "buddha", de: "Buddha" }
    ]},
    { id: "g19", title: "Chitwan: Im Dschungel", storyOnly: true, items: [
      { id: "l16_01", ne: "हात्ती", tr: "haatti", de: "Elefant" },
      { id: "l16_02", ne: "बाघ", tr: "baagh", de: "Tiger" },
      { id: "l16_03", ne: "जनावर", tr: "janaawar", de: "Tier" },
      { id: "l16_04", ne: "आगो", tr: "aago", de: "Feuer" }
    ]},
    { id: "g20", title: "Everest: Das Dach der Welt", storyOnly: true, items: [
      { id: "l17_01", ne: "हिउँ", tr: "hiun", de: "Schnee" },
      { id: "l17_02", ne: "खोला", tr: "kholaa", de: "Bach" },
      { id: "l17_03", ne: "झन्डा", tr: "jhandaa", de: "Fahne" },
      { id: "l17_04", ne: "नेपाल", tr: "Nepaal", de: "Nepal" }
    ]},
    { id: "g21", title: "Basis: Fragen, Verben & Gefühle", items: [
      { id: "l18_01", ne: "किन?", tr: "kina?", de: "Warum?" },
      { id: "l18_02", ne: "को?", tr: "ko?", de: "Wer?" },
      { id: "l18_03", ne: "हिजो", tr: "hijo", de: "gestern" },
      { id: "l18_04", ne: "दिउँसो", tr: "diuso", de: "Nachmittag" },
      { id: "l18_05", ne: "सुत्नु", tr: "sutnu", de: "schlafen" },
      { id: "l18_06", ne: "पिउनु", tr: "piunu", de: "trinken",
        note: "kennst du von पिउनुहोस् – trinken Sie" },
      { id: "l18_07", ne: "पकाउनु", tr: "pakaunu", de: "kochen" },
      { id: "l18_08", ne: "खुसी", tr: "khusi", de: "glücklich" },
      { id: "l18_09", ne: "दुखी", tr: "dukhi", de: "traurig" },
      { id: "l18_10", ne: "नराम्रो", tr: "naraamro", de: "nicht schön, schlecht",
        note: "das Gegenteil von राम्रो (raamro = gut)" },
      { id: "l18_11", ne: "साथी", tr: "saathi", de: "Freund" }
    ]}
  ]
}];

// Bausteine für Satz-Bau-Übungen (ids verweisen auf items oben)
window.BUILD_SENTENCES = ["l1_13", "l1_12", "l1_11", "l8_01", "l8_02", "l8_04"];

window.COMING = [
  { title: "एक, दुई, तीन", titleTr: "Ek, dui, tin", subtitle: "Zahlen & einfache Fragen" },
  { title: "यो के हो?", titleTr: "Yo ke ho?", subtitle: "Dinge benennen & Fragen stellen" }
];
