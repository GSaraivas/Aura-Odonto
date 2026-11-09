const CLINIC_CONFIG = {
  name: "AURA Odontologia",
  wordmark: "AURA",
  demo: true,
  whatsapp: "5511999999999", // Número demonstrativo. Substitua antes de desativar o modo demo.
  phone: "[Número da clínica]",
  address: "[Endereço da clínica]",
  email: "[E-mail da clínica]",
  instagram: "",
  businessHours: "[Horários de atendimento]",
  technicalLead: "[Nome e CRO-UF]",
  directions: "",
  showReviews: true,
  reviews: [], // { quote, author, date, source } — somente com autorização e verificação.
  treatments: [
    { icon: "shield", name: "Odontologia preventiva", summary: "Acompanhamento da saúde bucal e orientações para o cuidado diário.", detail: "O acompanhamento preventivo pode incluir avaliação da saúde bucal, revisão dos hábitos de higiene e orientações para a rotina. A frequência e as etapas são definidas durante a avaliação." },
    { icon: "sun", name: "Clareamento dental", summary: "Informações sobre técnicas de clareamento e critérios de avaliação.", detail: "O clareamento envolve técnicas para modificar a tonalidade dos dentes naturais. A avaliação ajuda a conversar sobre possibilidades, limitações e cuidados conforme as características de cada pessoa." },
    { icon: "align", name: "Ortodontia", summary: "Avaliação do alinhamento dos dentes e da relação entre as arcadas.", detail: "A ortodontia abrange a avaliação da posição dos dentes e da mordida. A conversa com o profissional pode incluir opções de aparelhos, acompanhamento e etapas do planejamento." },
    { icon: "implant", name: "Implantodontia", summary: "Avaliação de possibilidades de reabilitação com implantes dentários.", detail: "Implantes podem fazer parte de um planejamento para a reabilitação de dentes ausentes. A avaliação considera a saúde bucal, o histórico de saúde e as particularidades de cada pessoa." },
    { icon: "crown", name: "Prótese dentária", summary: "Planejamento de recursos protéticos de acordo com cada necessidade.", detail: "A prótese dentária reúne possibilidades para substituir ou restaurar estruturas dentárias. A escolha depende da avaliação, das condições bucais e dos objetivos discutidos com o profissional." },
    { icon: "smile", name: "Odontologia estética", summary: "Avaliação de aspectos como forma, proporção e cor dos dentes.", detail: "A avaliação estética considera as características dos dentes e a saúde bucal. O planejamento pode abordar forma, proporção e cor de acordo com as possibilidades identificadas na consulta." }
  ],
  team: [
    { name: "[Nome do profissional]", registration: "[CRO-UF 00000]", specialty: "[Especialidade registrada]", bio: "[Minibiografia aprovada pela clínica]", image: "assets/images/team/perfil-1.webp", alt: "Retrato ilustrativo de uma mulher com cabelo ondulado" },
    { name: "[Nome do profissional]", registration: "[CRO-UF 00000]", specialty: "[Especialidade registrada]", bio: "[Minibiografia aprovada pela clínica]", image: "assets/images/team/perfil-2.webp", alt: "Retrato ilustrativo de um homem com cabelo curto" },
    { name: "[Nome do profissional]", registration: "[CRO-UF 00000]", specialty: "[Especialidade registrada]", bio: "[Minibiografia aprovada pela clínica]", image: "assets/images/team/perfil-3.webp", alt: "Retrato ilustrativo de uma mulher com cabelo na altura dos ombros" }
  ],
  faq: [
    ["Como posso agendar uma consulta?", "Use o botão de agendamento para solicitar disponibilidade pelo WhatsApp. Nesta demonstração, o botão abre uma prévia da mensagem."],
    ["Quais tratamentos são oferecidos?", "A seção de tratamentos apresenta exemplos. Confirme as áreas de atendimento diretamente com a clínica após a publicação da versão real."],
    ["A clínica realiza avaliação inicial?", "Consulte a equipe para saber como funciona a primeira visita e verificar a disponibilidade de uma avaliação."],
    ["Como posso obter informações sobre horários?", "A seção de contato reúne os horários cadastrados. Na versão real, você também poderá consultar a equipe pelo WhatsApp."],
    ["É necessário passar por avaliação antes de iniciar um tratamento?", "A avaliação profissional permite entender as condições de saúde bucal e conversar sobre opções de cuidado antes de definir um plano."],
    ["Onde a clínica está localizada?", "A AURA é um conceito fictício. O endereço e o link de trajeto estarão disponíveis após a personalização com os dados da clínica."]
  ]
};
