import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    nome: 'Gloss Labial Rosa Hidratante',
    slug: 'gloss-labial-rosa-hidratante',
    descricao: 'Brilho espelhado com efeito plump suave e hidratação profunda com ácido hialurônico.',
    descricao_completa: 'O Gloss Labial Rosa Odi Silva Cosméticos une o acabamento vinil espelhado à nutrição ativa. Formulado com ácido hialurônico e vitamina E, ele preenche as linhas finas dos lábios, deixando uma tonalidade rosada delicada, sem sensação pegajosa. Perfeito para uso diário ou para finalizar sobre o batom.',
    categoria: 'maquiagem',
    preco: 29.90,
    preco_promocional: 24.90,
    imagem: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 18,
    destaque: true,
    mais_vendido: true,
    oferta: true,
    created_at: '2026-01-10T10:00:00Z',
    volume_ou_peso: '5ml',
    avaliacao: 4.9,
    total_avaliacoes: 124,
    beneficios: [
      'Não fica pegajoso nos lábios',
      'Com Ácido Hialurônico e Vitamina E',
      'Brilho radiante com tom rosado sutil',
      'Aplicador ergonômico e macio'
    ],
    modo_de_uso: 'Aplique suavemente sobre os lábios limpos utilizando o aplicador. Pode ser reaplicado sempre que desejar realçar a hidratação e o brilho.'
  },
  {
    id: 'prod-02',
    nome: 'Hidratante Facial Toque Seco Rosa Mosqueta',
    slug: 'hidratante-facial-toque-seco-rosa-mosqueta',
    descricao: 'Hidratação equilibrada com rápida absorção, niacinamida e óleo purificado de rosa mosqueta.',
    descricao_completa: 'Desenvolvido para revitalizar a pele sem pesar. Sua textura gel-creme ultraleve é absorvida em segundos, controlando a oleosidade enquanto mantém a barreira cutânea fortalecida e aveludada. Ideal para pré-maquiagem e rotina de skincare matinal e noturna.',
    categoria: 'skincare',
    preco: 39.90,
    imagem: 'https://images.unsplash.com/photo-1608248597359-001211e403fa?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1608248597359-001211e403fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 25,
    destaque: true,
    mais_vendido: true,
    oferta: false,
    created_at: '2026-01-12T11:30:00Z',
    volume_ou_peso: '50g',
    avaliacao: 4.8,
    total_avaliacoes: 98,
    beneficios: [
      'Toque seco e rápida absorção',
      'Uniformiza a textura da pele',
      'Fortalece a barreira de proteção natural',
      'Excelente primer pré-maquiagem'
    ],
    modo_de_uso: 'Com a pele limpa e seca, aplique uma pequena quantidade no rosto e pescoço, massageando com movimentos circulares ascendentes até completa absorção.'
  },
  {
    id: 'prod-03',
    nome: 'Eau de Parfum Floral Romance 100ml',
    slug: 'eau-de-parfum-floral-romance',
    descricao: 'Fragrância envolvente com notas de jasmim delicado, pétalas de rosa e fundo amadeirado doce.',
    descricao_completa: 'Uma essência marcante que celebra a sofisticação e feminilidade. Abre com notas frescas de bergamota e framboesa, evoluindo para um coração floral de jasmim sambac e rosas búlgaras, finalizando com um rastro aveludado de âmbar e baunilha pura.',
    categoria: 'perfumes',
    preco: 139.90,
    preco_promocional: 109.90,
    imagem: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 12,
    destaque: true,
    mais_vendido: true,
    oferta: true,
    created_at: '2026-01-05T09:15:00Z',
    volume_ou_peso: '100ml',
    avaliacao: 5.0,
    total_avaliacoes: 142,
    beneficios: [
      'Fixação duradoura de até 12 horas',
      'Embalagem refinada com tampa dourada',
      'Fragrância feminina, marcante e sofisticada',
      'Não resseca nem mancha tecidos'
    ],
    modo_de_uso: 'Borrife nas áreas de maior pulsação como pulsos, pescoço e atrás das orelhas a uma distância de 15cm.'
  },
  {
    id: 'prod-04',
    nome: 'Sérum Facial Vitamina C 15% Iluminador',
    slug: 'serum-facial-vitamina-c-iluminador',
    descricao: 'Ação antioxidante potente que clareia manchinhas, estimula colágeno e traz viço imediato.',
    descricao_completa: 'Concentrado com 15% de Vitamina C pura estabilizada associada ao ácido ferúlico. Protege contra os danos oxidativos da luz visível e poluição, prevenindo o envelhecimento precoce e conferindo luminosidade visível já na primeira semana.',
    categoria: 'skincare',
    preco: 79.90,
    preco_promocional: 59.90,
    imagem: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-001211e403fa?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 30,
    destaque: true,
    mais_vendido: false,
    oferta: true,
    created_at: '2026-01-15T14:20:00Z',
    volume_ou_peso: '30ml',
    avaliacao: 4.9,
    total_avaliacoes: 87,
    beneficios: [
      '15% Vitamina C Pura estabilizada',
      'Devolve o brilho e uniformidade ao rosto',
      'Estimula a síntese natural de colágeno',
      'Textura fluida aquosa não oleosa'
    ],
    modo_de_uso: 'Pela manhã, aplique de 3 a 4 gotas no rosto limpo antes do hidratante e protetor solar.'
  },
  {
    id: 'prod-05',
    nome: 'Máscara Capilar Nutrição Intensa Óleo de Argan',
    slug: 'mascara-capilar-nutricao-intensa-argan',
    descricao: 'Tratamento de salão para cabelos ressecados, com maciez instantânea e brilho espelhado.',
    descricao_completa: 'Fórmula ultra emoliente enriquecida com Óleo de Argan puro de primeira prensagem, manteiga de karité e queratina vegetal. Restaura a elasticidade das fibras capilares danificadas por química e calor térmico em apenas 3 minutos.',
    categoria: 'cabelos',
    preco: 64.90,
    preco_promocional: 49.90,
    imagem: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 20,
    destaque: false,
    mais_vendido: true,
    oferta: true,
    created_at: '2026-01-18T16:00:00Z',
    volume_ou_peso: '300g',
    avaliacao: 4.8,
    total_avaliacoes: 110,
    beneficios: [
      'Redução de 95% do frizz',
      'Ação condicionante e desembaraçante express',
      'Brilho e maciez da raiz às pontas',
      'Livre de parabenos e sulfatos pesados'
    ],
    modo_de_uso: 'Após lavar com shampoo, aplique mecha por mecha enluvando os fios. Deixe agir de 3 a 5 minutos e enxágue abundantemente.'
  },
  {
    id: 'prod-06',
    nome: 'Paleta de Sombras Nude & Rosé Glamour',
    slug: 'paleta-sombras-nude-rose-glamour',
    descricao: '12 tons matte e cintilantes com pigmentação aveludada e alta fixação para esfumados perfeitos.',
    descricao_completa: 'Uma seleção de cores versáteis inspirada na delicadeza e luxo das pedras preciosas. Tons neutros, rosados suaves e iluminadores metálicos de fácil esfumado, sem esfarelar. Acompanha espelho interno de alta definição.',
    categoria: 'maquiagem',
    preco: 89.90,
    preco_promocional: 74.90,
    imagem: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 14,
    destaque: true,
    mais_vendido: true,
    oferta: true,
    created_at: '2026-01-20T08:00:00Z',
    volume_ou_peso: '18g',
    avaliacao: 4.9,
    total_avaliacoes: 76,
    beneficios: [
      'Alta pigmentação com uma só passada',
      'Tons que combinam com todos os tons de pele',
      'Textura macia amanteigada',
      'Espelho amplo para maquiagem em qualquer lugar'
    ],
    modo_de_uso: 'Aplique com pincel específico nas pálpebras, esfumando com movimentos circulares para transições suaves.'
  },
  {
    id: 'prod-07',
    nome: 'Body Splash Velvet Vanilla & Flor de Algodão',
    slug: 'body-splash-velvet-vanilla',
    descricao: 'Perfumação leve, doce e relaxante para o corpo todo, ideal para o pós-banho.',
    descricao_completa: 'Uma névoa perfumada que abraça a pele. Combina a cremosidade da baunilha de Madagascar com o frescor suave das flores de algodão e extrato calmante de camomila. Sensação de frescor aconchegante para borrifar ao longo de todo o dia.',
    categoria: 'corpo-e-banho',
    preco: 49.90,
    preco_promocional: 39.90,
    imagem: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 35,
    destaque: false,
    mais_vendido: true,
    oferta: true,
    created_at: '2026-02-01T12:00:00Z',
    volume_ou_peso: '200ml',
    avaliacao: 4.7,
    total_avaliacoes: 93,
    beneficios: [
      'Fragrância aconchegante e delicada',
      'Sensação prolongada de banho tomado',
      'Embalagem generosa e prática'
    ],
    modo_de_uso: 'Borrife generosamente pelo corpo após o banho ou sempre que quiser se refrescar e perfumar.'
  },
  {
    id: 'prod-08',
    nome: 'Kit Skincare Glow Radiante 4 Passos',
    slug: 'kit-skincare-glow-radiante',
    descricao: 'Rotina completa: Gel de limpeza, Tônico suavizante, Sérum antioxidante e Hidratante facial.',
    descricao_completa: 'O kit dos sonhos para quem quer praticidade e resultados visíveis. Vem em uma linda caixa presenteável rosa com detalhes dourados, perfeita para iniciar a rotina de autocuidado diário ou surpreender alguém especial.',
    categoria: 'kits-de-beleza',
    preco: 189.90,
    preco_promocional: 149.90,
    imagem: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 8,
    destaque: true,
    mais_vendido: true,
    oferta: true,
    created_at: '2026-02-05T15:00:00Z',
    volume_ou_peso: 'Kit 4 itens',
    avaliacao: 5.0,
    total_avaliacoes: 64,
    beneficios: [
      'Economia de mais de 25% em relação aos itens avulsos',
      'Passo a passo numerado de fácil acompanhamento',
      'Acompanha linda caixa presenteável rosa',
      'Adequado a todos os tipos de pele'
    ],
    modo_de_uso: 'Passo 1: Higienizar com o Gel. Passo 2: Tonificar. Passo 3: Gotas de Sérum. Passo 4: Selar com o Hidratante.'
  },
  {
    id: 'prod-09',
    nome: 'Esmalte Gel Brilho Extremo Rosa Chiclete',
    slug: 'esmalte-gel-rosa-chiclete',
    descricao: 'Efeito gel sem necessidade de cabine UV, secagem rápida e durabilidade de até 10 dias.',
    descricao_completa: 'Cor viva e cobertura espelhada desde a primeira camada. O pincel em formato flat facilita a aplicação sem borrar as cutículas, oferecendo acabamento profissional em casa.',
    categoria: 'unhas',
    preco: 18.90,
    imagem: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 40,
    destaque: false,
    mais_vendido: false,
    oferta: false,
    created_at: '2026-02-10T10:00:00Z',
    volume_ou_peso: '9ml',
    avaliacao: 4.8,
    total_avaliacoes: 52,
    beneficios: [
      'Secagem ultra rápida',
      'Pincel anatômico que não mancha',
      'Fórmula 9-free hipoalergênica'
    ],
    modo_de_uso: 'Agite antes de usar. Aplique duas camadas uniformes sobre as unhas preparadas e limpas.'
  },
  {
    id: 'prod-10',
    nome: 'Kit 8 Pincéis de Maquiagem Cerdas Ruby Rose Gold',
    slug: 'kit-8-pinceis-maquiagem-ruby-gold',
    descricao: 'Cerdas sintéticas ultra macias e densas para aplicação uniforme de pó, base e sombras.',
    descricao_completa: 'Conjunto completo com design luxuoso em tons rosa bebê e acabamento metálico gold. Cerdas hipoalergênicas cruelty-free que não soltam pelos e proporcionam acabamento polido sem marcas.',
    categoria: 'acessorios',
    preco: 94.90,
    preco_promocional: 79.90,
    imagem: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 15,
    destaque: true,
    mais_vendido: false,
    oferta: true,
    created_at: '2026-02-12T11:00:00Z',
    volume_ou_peso: '8 pincéis + estojo',
    avaliacao: 4.9,
    total_avaliacoes: 48,
    beneficios: [
      'Cerdas microfinas sem desperdício de produto',
      'Cabo anatômico com peso balanceado',
      'Acompanha estojo protetor'
    ],
    modo_de_uso: 'Utilize cada pincel de acordo com a área indicada: base, pó, blush, iluminador e esfumado nos olhos.'
  },
  {
    id: 'prod-11',
    nome: 'Óleo Corporal Iluminador Dourado & Semente de Uva',
    slug: 'oleo-corporal-iluminador-dourado',
    descricao: 'Partículas de mica perolada dourada que iluminam o colo, pernas e braços com toque aveludado.',
    descricao_completa: 'Realce o bronzeado e o brilho natural da pele com este elixir corporal. Rico em antioxidantes do óleo vegetal de semente de uva e aroma delicado floral ambarado. Não mancha a roupa e deixa a pele radiante.',
    categoria: 'corpo-e-banho',
    preco: 59.90,
    preco_promocional: 44.90,
    imagem: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 22,
    destaque: true,
    mais_vendido: false,
    oferta: true,
    created_at: '2026-02-14T09:30:00Z',
    volume_ou_peso: '120ml',
    avaliacao: 4.9,
    total_avaliacoes: 63,
    beneficios: [
      'Partículas de brilho douradas ultrafinas',
      'Nutrição com óleo de semente de uva',
      'Absorção rápida sem aspecto pegajoso'
    ],
    modo_de_uso: 'Agite bem antes de usar para dispersar as partículas iluminadoras. Espalhe pelo corpo com as mãos.'
  },
  {
    id: 'prod-12',
    nome: 'Batom Matte Velvet Rosa Marcante',
    slug: 'batom-matte-velvet-rosa-marcante',
    descricao: 'Acabamento matte aveludado confortável, pigmentação intensa e longa duração.',
    descricao_completa: 'Uma tonalidade rosa sofisticada e cheia de personalidade. Fórmula com manteiga de cacau e ceramidas que previne o ressecamento, mantendo a boca macia com cor uniforme por até 10 horas.',
    categoria: 'maquiagem',
    preco: 34.90,
    imagem: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&w=800&q=80',
    imagens: [
      'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    ],
    estoque: 28,
    destaque: false,
    mais_vendido: true,
    oferta: false,
    created_at: '2026-02-18T13:00:00Z',
    volume_ou_peso: '3.8g',
    avaliacao: 4.8,
    total_avaliacoes: 79,
    beneficios: [
      'Conforto absoluto sem craquelar',
      'Cor rica em uma única aplicação',
      'Alta fixação resistente a bebidas'
    ],
    modo_de_uso: 'Deslize a bala do batom diretamente sobre os lábios contornando primeiro o arco do cupido.'
  }
];
