
export const store = {
  name: 'SETOR NORTH',
  tagline: 'Streetwear urbano',
  location: 'Altamira - PA',
  logo: '/images/setornorth.jpeg',
  whatsapp: '5593991707749',
  instagram: 'setor.north',
  instagramUrl: 'https://instagram.com/setor.north',
  email: '',
}


export const hero = {
  // imagem de fundo opcional: coloque em /public/images/hero/ e use '/images/hero/arquivo.jpg'
  background: '',
  logo: '/images/setornorth.jpeg',
  images: [
    '/images/hero/turma.jpg',
    '/images/hero/modelo.jpg',
  ],
  kicker: 'Altamira - PA',
  title: 'SETOR NORTH',
  subtitle:
    'Streetwear urbano com pronta entrega e personalização DTF. Presença limpa, contraste forte, identidade própria.',
  primaryCta: 'Ver pronta entrega',
  secondaryCta: 'Personalizar blusa',
}

export const categories = ['Todos', 'Camisetas', 'Oversized', 'Moletons', 'Ecobags']

export const products = [
  {
    id: 'SN-CAM-001',
    name: 'Camiseta Oversized Preta',
    category: 'Oversized',
    color: 'Preto',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    image: '/images/products/sn-cam-001.jpg',
    status: 'disponivel',
    featured: true,
  },
  {
    id: 'SN-CAM-002',
    name: 'Camiseta Gangster',
    category: 'Camisetas',
    color: 'Preto',
    price: 79.9,
    sizes: ['P', 'M', 'G', 'GG'],
    image: '/images/products/sn-cam-002.jpg',
    status: 'disponivel',
  },
  {
    id: 'SN-CAM-003',
    name: 'Camiseta Chronic Branca',
    category: 'Camisetas',
    color: 'Branco',
    price: 79.9,
    sizes: ['P', 'M', 'G'],
    image: '/images/products/sn-cam-003.jpg',
    status: 'disponivel',
  },
  {
    id: 'SN-CAM-004',
    name: 'Camiseta Evangelion',
    category: 'Camisetas',
    color: 'Preto',
    price: 84.9,
    sizes: ['M', 'G', 'GG'],
    image: '/images/products/sn-cam-004.jpg',
    status: 'esgotado',
  },
  {
    id: 'SN-MOL-001',
    name: 'Moletom Capuz Verde',
    category: 'Moletons',
    color: 'Verde',
    price: 169.9,
    sizes: ['M', 'G', 'GG'],
    image: '/images/products/sn-mol-001.jpg',
    status: 'disponivel',
    featured: true,
  },
  {
    id: 'SN-ECO-001',
    name: 'Ecobag Evangelion',
    category: 'Ecobags',
    color: 'Off-white',
    price: 39.9,
    sizes: ['Único'],
    image: '/images/products/sn-eco-001.jpg',
    status: 'disponivel',
  },
  {
    id: 'SN-ECO-002',
    name: 'Ecobag Setor North',
    category: 'Ecobags',
    color: 'Off-white',
    price: 39.9,
    sizes: ['Único'],
    image: '/images/products/sn-eco-002.jpg',
    status: 'disponivel',
  },
  {
    id: 'SN-CAM-005',
    name: 'Camiseta Oversized Branca',
    category: 'Oversized',
    color: 'Branco',
    price: 89.9,
    sizes: ['P', 'M', 'G', 'GG'],
    image: '/images/products/sn-cam-005.jpg',
    status: 'disponivel',
  },
]

// ---------------------------------------------------------------------------
// PERSONALIZAÇÃO DTF
// ---------------------------------------------------------------------------
export const dtf = {
  title: 'Personalização DTF',
  subtitle: 'Personalizamos blusas em DTF — sua arte, sua peça.',
  steps: [
    { n: '01', title: 'Envie sua arte', text: 'Mande a imagem ou ideia pelo WhatsApp.' },
    { n: '02', title: 'Escolha a peça', text: 'Modelo, cor e tamanho da blusa.' },
    { n: '03', title: 'Aprove o mockup', text: 'Enviamos a prévia antes de produzir.' },
    { n: '04', title: 'Receba personalizada', text: 'Sua blusa pronta com acabamento DTF.' },
  ],
  cta: 'Solicitar orçamento no WhatsApp',
}

// ---------------------------------------------------------------------------
// DROP (lançamento) — JÁ CODADO, ESCONDIDO POR PADRÃO
// ---------------------------------------------------------------------------
// status:
//   'inactive'   -> não aparece em lugar nenhum (padrão)
//   'comingSoon' -> aparece com cronômetro até a data abaixo
//   'live'       -> mostra os produtos do drop
//   'ended'      -> mostra "encerrado"
export const drop = {
  status: 'inactive',
  name: 'DROP 01',
  tagline: 'Coleção limitada. Quando acabar, acabou.',
  // Data/hora alvo (ISO). Usada no countdown do "comingSoon".
  releaseDate: '2026-12-31T20:00:00',
  // Produtos exclusivos do drop (mesmo formato dos products)
  products: [
    // {
    //   id: 'SN-DROP-001', name: 'Camiseta Drop 01', category: 'Camisetas',
    //   color: 'Preto', price: 119.9, sizes: ['P','M','G','GG'],
    //   image: '/images/products/sn-drop-001.jpg', status: 'disponivel',
    // },
  ],
}

// ---------------------------------------------------------------------------
// LOOKBOOK
// ---------------------------------------------------------------------------
export const lookbook = {
  title: 'Lookbook',
  caption: 'A rua veste Setor North.',
  images: [
    { src: '/images/lookbook/look-01.jpg', alt: 'Look 01' },
    { src: '/images/lookbook/look-02.jpg', alt: 'Look 02' },
    { src: '/images/lookbook/look-03.jpg', alt: 'Look 03' },
  ],
  instagramCta: 'Ver mais no Instagram',
}

// ---------------------------------------------------------------------------
// SOBRE A MARCA
// ---------------------------------------------------------------------------
export const about = {
  title: 'Sobre a marca',
  text: 'A Setor North nasce da rua, do movimento e da estética urbana. Criamos peças com presença limpa, contraste forte e identidade própria.',
}

// ---------------------------------------------------------------------------
// CONTATO / RODAPÉ
// ---------------------------------------------------------------------------
export const footer = {
  exchangePolicy:
    'Trocas em até 7 dias após o recebimento, com etiqueta e sem uso. Fale com a gente pelo WhatsApp.',
  sizeChart: [
    { size: 'P', chest: '52 cm', length: '70 cm' },
    { size: 'M', chest: '56 cm', length: '72 cm' },
    { size: 'G', chest: '60 cm', length: '74 cm' },
    { size: 'GG', chest: '64 cm', length: '76 cm' },
  ],
  serviceNote: 'Atendimento online • Altamira - PA',
}
