import { GrammarRule } from './types.ts';

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: "estar_adjetivo",
    titleEs: "ESTAR + ADJETIVO (Estados temporales y emocionales)",
    titleHy: "ESTAR + ԱԾԱԿԱՆ (Ժամանակավոր և հուզական վիճակներ)",
    explanationEs: "Usamos el verbo 'estar' con adjetivos para expresar estados de ánimo, sensaciones físicas o condiciones temporales del sujeto.",
    explanationHy: "Օգտագործում ենք «estar» բայը ածականների հետ՝ արտահայտելու տրամադրություն, ֆիզիկական զգացողություններ կամ ժամանակավոր վիճակներ։",
    examples: [
      {
        es: "Estoy feliz.",
        hy: "Ես երջանիկ եմ։",
        noteEs: "En el vídeo: 'estoy muy feliz de volver'.",
        noteHy: "Տեսանյութում. «estoy muy feliz de volver» (ուրախ եմ վերադառնալու համար)։",
      },
      {
        es: "Estoy contento.",
        hy: "Ես գոհ / ուրախ եմ։",
        noteEs: "En el vídeo: 'sí, muy contento'.",
        noteHy: "Տեսանյութում. «sí, muy contento» (այո՛, շատ գոհ եմ)։",
      },
      {
        es: "Estoy listo.",
        hy: "Ես պատրաստ եմ։",
        noteEs: "En el vídeo: 'estoy listo para volver y competir'.",
        noteHy: "Տեսանյութում. «estoy listo para volver y competir» (պատրաստ եմ մրցելու)։",
      },
    ],
  },
  {
    id: "estar_gerundio",
    titleEs: "ESTAR + GERUNDIO (Acciones en desarrollo)",
    titleHy: "ESTAR + ԴԵՐԲԱՅ (Շարունակական գործողություններ)",
    explanationEs: "Esta perífrasis verbal describe una acción que está ocurriendo en este mismo momento o a lo largo del periodo actual de entrenamiento.",
    explanationHy: "Այս կառույցը նկարագրում է գործողություն, որը տեղի է ունենում հենց այս պահին կամ ներկա մարզական շրջանում։",
    examples: [
      {
        es: "Estoy entrenando.",
        hy: "Ես մարզվում եմ։",
        noteEs: "Formado por estar + gerundio terminado en -ando.",
        noteHy: "Կազմված է estar + -ando վերջավորությամբ դերբայից։",
      },
      {
        es: "Estamos corriendo.",
        hy: "Մենք վազում ենք։",
        noteEs: "En el vídeo el jugador menciona: 'corriendo mucho en el calor'.",
        noteHy: "Տեսանյութում. «corriendo mucho en el calor» (շատ վազելով շոգին)։",
      },
      {
        es: "Estamos jugando.",
        hy: "Մենք խաղում ենք։",
        noteEs: "Describe el juego en equipo durante las sesiones.",
        noteHy: "Նկարագրում է թիմային խաղը մարզումների ժամանակ։",
      },
    ],
  },
  {
    id: "ojala_subjuntivo",
    titleEs: "OJALÁ + SUBJUNTIVO (Expresar deseos)",
    titleHy: "OJALÁ + ԸՂՁԱԿԱՆ ԵՂԱՆԱԿ (Ցանկության արտահայտում)",
    explanationEs: "'Ojalá' (de origen árabe: 'si Dios quiere') siempre exige el modo subjuntivo para manifestar un deseo de futuro.",
    explanationHy: "«Ojalá» բառը (նշանակում է «հուսով եմ / երանի թե») միշտ պահանջում է ըղձական եղանակ (subjuntivo)՝ ապագայի ցանկություն արտահայտելու համար։",
    examples: [
      {
        es: "Ojalá gane.",
        hy: "Հուսով եմ՝ կհաղթենք (կհաղթի)։",
        noteEs: "En el vídeo: 'y ojalá gane'. Subjuntivo presente de ganar.",
        noteHy: "Տեսանյութում. «y ojalá gane» (ganar բայի subjuntivo ձևը)։",
      },
      {
        es: "Ojalá juguemos bien.",
        hy: "Հուսով եմ՝ լավ կխաղանք։",
        noteEs: "Primera persona del plural del subjuntivo.",
        noteHy: "Հոգնակի առաջին դեմք (մենք)։",
      },
      {
        es: "Ojalá tengamos una buena temporada.",
        hy: "Հուսով եմ՝ լավ մրցաշրջան կունենանք։",
        noteEs: "Subjuntivo irregular del verbo tener.",
        noteHy: "Tener բայի անկանոն ըղձական ձևը։",
      },
    ],
  },
  {
    id: "verbo_gustar",
    titleEs: "EL VERBO GUSTAR (Preferencias y aficiones)",
    titleHy: "GUSTAR ԲԱՅԸ (Նախասիրություններ և հաճույք)",
    explanationEs: "El verbo 'gustar' concuerda con lo que produce agrado. Se acompaña de pronombres de objeto indirecto (me, te, le, nos, os, les).",
    explanationHy: "«Gustar» բայը համաձայնեցվում է այն բանի հետ, ինչը հաճույք է պատճառում, և օգտագործվում է անուղղակի դերանուններով (me, te, le, nos, os, les)։",
    examples: [
      {
        es: "Me gusta mucho.",
        hy: "Ինձ շատ է դուր գալիս։",
        noteEs: "En el vídeo: 'y me gusta mucho' tras hablar del esfuerzo físico.",
        noteHy: "Տեսանյութում. «y me gusta mucho» ծանր մարզումների մասին խոսելիս։",
      },
      {
        es: "Me gusta entrenar.",
        hy: "Ինձ դուր է գալիս մարզվել։",
        noteEs: "Gustar + infinitivo va siempre en singular ('gusta').",
        noteHy: "Անորոշ դերբայի հետ միշտ դրվում է եզակի ձևով («gusta»)։",
      },
      {
        es: "Me gusta jugar con mis compañeros.",
        hy: "Ինձ դուր է գալիս խաղալ թիմակիցներիս հետ։",
        noteEs: "Expresa compañerismo y placer por el juego colectivo.",
        noteHy: "Արտահայտում է թիմակիցների հետ խաղալու հաճույքը։",
      },
    ],
  },
  {
    id: "forma_natural",
    titleEs: "FORMA MÁS NATURAL (Análisis de habla oral espontánea)",
    titleHy: "ԱՎԵԼԻ ԲՆԱԿԱՆ ՁԵՎԸ (Խոսակցական իսպաներենի վերլուծություն)",
    explanationEs: "En el fútbol profesional, las entrevistas en directo reflejan la espontaneidad del jugador. Aquí analizamos cómo se diría en español formal o nativo sin alterar la transcripción original.",
    explanationHy: "Ուղիղ հարցազրույցներում հաճախ հանդիպում են ոչ լիովին կանոնավոր ձևեր։ Այստեղ ներկայացնում ենք ավելի բնական տարբերակները՝ պահպանելով բնօրինակ տեքստը։",
    examples: [
      {
        es: "«una experiencia muy bien» → «una experiencia muy buena»",
        hy: "«շատ լավ փորձառություն» (մակբայի փոխարեն գոյականի հետ դրվում է ածական՝ «buena»)",
        noteEs: "'Bien' es adverbio; con el sustantivo femenino 'experiencia' corresponde el adjetivo 'buena'.",
        noteHy: "«Bien»-ը մակբայ է, իսկ «experiencia» գոյականի հետ բնական է «buena» ածականը։",
      },
      {
        es: "«ver a él» → «verlo» o «ver cómo es él»",
        hy: "«նրան տեսնել» (անձնական դերանվան ուղիղ խնդիրը՝ «verlo»)",
        noteEs: "En español se prefiere el pronombre clítico de objeto directo 'verlo' en lugar de 'ver a él'.",
        noteHy: "Իսպաներենում նախընտրելի է օգտագործել «verlo» ձևը։",
      },
      {
        es: "«muy excitado» → «muy ilusionado» o «emocionado»",
        hy: "«շատ ոգևորված / ոգեշնչված»",
        noteEs: "'Excitado' suele ser calco del inglés 'excited'. En español deportivo decimos 'ilusionado', 'motivado' o 'con muchas ganas'.",
        noteHy: "«Excitado»-ն անգլերեն «excited» բառի պատճենումն է։ Սպորտում ավելի ընդունված է «ilusionado» կամ «motivado»։",
      },
      {
        es: "«soy un poco más de hombre ahora» → «me siento más maduro»",
        hy: "«հիմա ինձ ավելի հասուն եմ զգում»",
        noteEs: "Para expresar crecimiento personal se utiliza 'he madurado' o 'me siento más maduro'.",
        noteHy: "Անձնական աճի համար ընդունված է ասել «me siento más maduro»։",
      },
    ],
  },
];
