# Canyon Game Studio — site

Site estático publicado na Vercel (`www.canyongamestudio.com`). As páginas são **geradas** por um script, sem dependências.

## Como editar

1. Textos (EN e PT), links e dados dos jogos: `src/content.mjs`
2. Estrutura das páginas: `src/templates.mjs`
3. Visual: `css/styles.css` · Comportamento: `js/`
4. Gere as páginas e faça commit do resultado:

```
node tools/build.mjs
```

Para ver o site no seu PC, rode `node tools/serve.mjs` e abra http://localhost:8080. Abrir o `index.html` direto do disco não carrega o CSS, porque as páginas usam caminhos a partir da raiz (`/css/...`).

Não edite `index.html`, `pt/`, `trash-party/`, `trash-corp/`, `trash-blood/`, `404.html`, `sitemap.xml`, `site.webmanifest` ou `vercel.json` à mão: o build sobrescreve.

O build também:
- coloca `?v=<hash>` em CSS, JS e imagens (cache longo seguro);
- confere tamanho de títulos e descrições para SEO;
- gera o `vercel.json` (headers de segurança, cache, redirects e links curtos).

## Páginas

| URL | Página |
|---|---|
| `/` e `/pt/` | Home (EN / PT) |
| `/trash-party/`, `/trash-corp/`, `/trash-blood/` | Páginas dos jogos (e as versões em `/pt/...`) |

Links curtos (bio do Instagram, posts): `/demo`, `/wishlist`, `/steam`, `/instagram`.

## Jogo novo

Adicione um item em `GAMES` (`src/content.mjs`), coloque as imagens em `images/games/<slug>/` (`key-art-800.webp`, `key-art-1600.webp`, `key-art.jpg`, `og.jpg` 1200×630) e rode o build.

## Métricas

- **Vercel Web Analytics:** ativado no painel da Vercel; as páginas carregam `/_vercel/insights/script.js` (sem cookies). O plano Hobby guarda 30 dias de dados.
- **Steam UTM:** todos os links para a Steam têm `utm_source=canyongamestudio` (Steamworks → Marketing → UTM Analytics).

## Demo da Steam (Next Fest)

O botão da demo some sozinho depois de `SITE.demoEnds` (26/10/2026). Rode o build de novo depois dessa data para atualizar os textos de compartilhamento e o link curto `/demo`.
