// ============ i18n ============
const I18N = {
  en: {
    nav_about: "Who We Are", nav_games: "Games", nav_contact: "Contact",
    hero_eyebrow: "Indie Co-op Studio · Praia Grande, Brazil",
    hero_title: "PLAY<br/>TOGET<span class='o'>H</span>ER.",
    hero_tag: "We build cooperative games made for the nights you spend with friends, the ones that end with \"just one more round.\"",
    chip_coop:"CO-OP", chip_indie:"INDIE", chip_horror:"HORROR", chip_adventure:"ADVENTURE",
    about_title: "FROM THE<br/>CANYONS.",
    about_lead: "Canyon Game Studio was founded by <b>two friends</b> who have known each other since their school days. What started as a dream, to build games together someday, slowly took shape over the years into the studio it is now.",
    val1_title:"Built for Friends", val1_body:"Every game we make is cooperative at its heart. We design for shared moments, the laughter, the panic, the teamwork that only happens when you're playing side by side.",
    val2_title:"Rooted in Nature", val2_body:"Our name comes from the canyons of our hometown. That love for wild, vast landscapes runs through everything, a sense of adventure and exploration in every world we build.",
    val3_title:"Our Mission", val3_body:"To create games that let more people have fun with their friends, the same way we always have. Bringing people together, one match at a time.",
    manifesto_kicker:"Manifesto",
    manifesto_title:"GAMES ARE<br/>BETTER<br/>WITH FRIENDS.",
    manifesto_body:"Born in the canyons of southern Brazil, where two friends turned game nights into a career. We believe in cooperative games, the ones you finish screaming on Discord at 3 AM, with someone saying \"one more round.\"",
    manifesto_sign:"Canyon Game Studio",
    games_title:"OUR GAMES",
    games_side:"Our first title is in the works, with more worlds on the horizon.",
    tag_players:"1–4 Players", soon:"Coming Soon",
    game1_name:"Trash Corp.", game1_genre:"Co-op · Horror · Extraction",
    game1_desc:"Trash Corp. is a cooperative horror extraction game for 1 to 4 players. Drive a space garbage truck and travel between planets. Fight radioactive monsters. Do whatever it takes to survive and hit the quota!",
    game3_name:"More to Come", game3_genre:"TBA",
    game3_desc:"We're just getting started. New worlds and new ways to play together are on the way.",
    contact_title:"LET'S BUILD<br/>SOMETHING.",
    contact_body:"Want to collaborate, publish with us, or just talk games? We'd love to hear from you.",
    foot_explore:"Explore", foot_connect:"Connect", foot_tag:"Made for co-op nights."
  },
  pt: {
    nav_about: "Quem Somos", nav_games: "Jogos", nav_contact: "Contato",
    hero_eyebrow: "Estúdio Indie Co-op · Praia Grande, Brasil",
    hero_title: "JOGUEM<br/>JUN<span class='o'>T</span>OS.",
    hero_tag: "Criamos jogos cooperativos feitos para aquelas noites com os amigos, as que terminam com \"só mais uma partida.\"",
    chip_coop:"CO-OP", chip_indie:"INDIE", chip_horror:"TERROR", chip_adventure:"AVENTURA",
    about_title: "DOS<br/>CANYONS.",
    about_lead: "O Canyon Game Studio nasceu de <b>dois amigos</b> que se conhecem desde os tempos de escola. O que começou como um sonho, criar jogos juntos algum dia, foi tomando forma ao longo dos anos até virar o estúdio que é hoje.",
    val1_title:"Feito para Amigos", val1_body:"Todo jogo que fazemos é cooperativo em essência. Projetamos para momentos compartilhados, as risadas, o pânico, o trabalho em equipe que só acontece jogando lado a lado.",
    val2_title:"Raízes na Natureza", val2_body:"Nosso nome vem dos canyons da nossa cidade. Esse amor por paisagens vastas e selvagens atravessa tudo, um senso de aventura e exploração em cada mundo que criamos.",
    val3_title:"Nossa Missão", val3_body:"Criar jogos que permitam que mais pessoas se divirtam com seus amigos, do jeito que sempre fizemos. Unindo as pessoas, uma partida de cada vez.",
    manifesto_kicker:"Manifesto",
    manifesto_title:"JOGOS SÃO<br/>MELHORES<br/>COM AMIGOS.",
    manifesto_body:"Nascemos nos canyons do sul do Brasil, onde dois amigos transformaram noites de jogos em carreira. Acreditamos em games cooperativos, os que você termina gritando no Discord às 3 da manhã, com alguém dizendo \"só mais uma partida\".",
    manifesto_sign:"Canyon Game Studio",
    games_title:"NOSSOS JOGOS",
    games_side:"Nosso primeiro título está a caminho, com mais mundos no horizonte.",
    tag_players:"1–4 Jogadores", soon:"Em Breve",
    game1_name:"Trash Corp.", game1_genre:"Co-op · Terror · Extração",
    game1_desc:"Trash Corp. é um jogo cooperativo de extração de terror para 1 a 4 jogadores. Dirija um caminhão de lixo espacial e viaje entre diversos planetas. Lute contra monstros radioativos. Faça o possível para sobreviver e cumprir a meta!",
    game3_name:"Em Breve", game3_genre:"A Anunciar",
    game3_desc:"Estamos apenas começando. Novos mundos e novas formas de jogar junto estão a caminho.",
    contact_title:"VAMOS CRIAR<br/>ALGO JUNTOS.",
    contact_body:"Quer colaborar, publicar com a gente ou só falar sobre jogos? Vamos adorar ouvir você.",
    foot_explore:"Explore", foot_connect:"Conecte-se", foot_tag:"Feito para noites de co-op."
  }
};

function applyLang(lang){
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = (lang === 'pt' ? 'pt-br' : 'en');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key] == null) return;
    if(el.hasAttribute('data-i18n-html')) el.innerHTML = dict[key];
    else el.textContent = dict[key];
  });
  document.querySelectorAll('.lang-toggle button').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));
  try{ localStorage.setItem('canyon_lang', lang); }catch(e){}
  if (window.initRevealTitles) window.initRevealTitles();
}

document.querySelectorAll('.lang-toggle button').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// init from saved pref
let savedLang = 'en';
try{ savedLang = localStorage.getItem('canyon_lang') || 'en'; }catch(e){}
applyLang(savedLang);
