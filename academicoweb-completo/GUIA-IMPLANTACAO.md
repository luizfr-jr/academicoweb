# 🎓 AcadêmicoWeb — Guia de Implantação Completo
## Supabase (banco de dados) + GitHub Pages (hospedagem)

---

## PASSO 1 — Criar conta e projeto no Supabase

1. Acesse **https://supabase.com** e clique em **Start your project**
2. Crie conta com Google ou e-mail da UFN
3. Clique em **New Project**
4. Preencha:
   - **Organization:** seu nome ou UFN
   - **Name:** `academicoweb`
   - **Database Password:** anote essa senha em lugar seguro
   - **Region:** escolha **South America (São Paulo)**
5. Clique em **Create new project** e aguarde ~2 minutos

---

## PASSO 2 — Criar as tabelas no banco de dados

1. No painel do Supabase, clique em **SQL Editor** (menu lateral)
2. Clique em **New Query**
3. Abra o arquivo **`supabase-setup.sql`** que está nesta pasta
4. Copie todo o conteúdo e cole no editor
5. Clique em **Run** (ou Ctrl+Enter)
6. Deve aparecer "Success. No rows returned" — isso é normal e correto

✅ Suas tabelas foram criadas com os dados de exemplo!

---

## PASSO 3 — Copiar as chaves do Supabase

1. No painel do Supabase, vá em **Project Settings** → **API**
2. Copie os dois valores:
   - **Project URL** → algo como `https://abcdefghij.supabase.co`
   - **anon public** key → string longa começando com `eyJ...`
3. Guarde esses valores, você vai precisar deles nos próximos passos

---

## PASSO 4 — Colocar o código no GitHub

1. Acesse **https://github.com** e crie conta (se não tiver)
2. Clique em **New repository**
3. Nome do repositório: `academicoweb` (exatamente igual ao que está no vite.config.ts)
4. Deixe **Public** marcado
5. Clique em **Create repository**

Agora faça upload do código:

**Opção A — Pelo terminal (recomendado):**
```bash
# Na pasta do projeto (notas-academicas):
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/academicoweb.git
git push -u origin main
```

**Opção B — Pela interface do GitHub:**
- Clique em **uploading an existing file**
- Arraste toda a pasta do projeto
- Clique em **Commit changes**

---

## PASSO 5 — Configurar as variáveis de ambiente no GitHub

1. No repositório GitHub, clique em **Settings** (aba superior)
2. No menu lateral, clique em **Secrets and variables** → **Actions**
3. Clique em **New repository secret** e adicione:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Secret: cole a **Project URL** do passo 3

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Secret: cole a **anon public key** do passo 3

4. Salve cada um clicando em **Add secret**

---

## PASSO 6 — Ativar o GitHub Pages

1. No repositório, vá em **Settings** → **Pages** (menu lateral)
2. Em **Source**, selecione **GitHub Actions**
3. Salve

---

## PASSO 7 — Fazer o primeiro deploy

1. No repositório, vá na aba **Actions**
2. Clique no workflow **Deploy to GitHub Pages**
3. Clique em **Run workflow** → **Run workflow**
4. Aguarde ~2 minutos até o círculo ficar verde ✅

---

## PASSO 8 — Acessar o sistema

Após o deploy, seu sistema estará disponível em:

```
https://SEU_USUARIO.github.io/academicoweb/
```

Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.

---

## 🔑 Acessos iniciais

| Tipo | E-mail | Senha |
|------|--------|-------|
| Professor | prof@ufn.edu.br | 123 |
| Aluno João | joao@email.com | 123 |
| Aluno Maria | maria@email.com | 123 |
| Aluno Carlos | carlos@email.com | 123 |

**Importante:** Após o primeiro login como professor, vá em cada aluno
e altere a senha deles para algo mais seguro, ou crie usuários novos
com senhas individuais pela aba "Alunos" de cada disciplina.

---

## 📋 Fluxo de uso no dia a dia

### Como professor:
1. Acesse o sistema e faça login como Professor
2. Crie suas disciplinas (botão **+ Nova Disciplina**)
3. Dentro de cada disciplina, adicione as atividades com pesos (aba **Atividades**)
4. Adicione seus alunos (aba **Alunos** → **+ Adicionar Aluno**)
   - Informe nome, e-mail e senha inicial de cada aluno
5. Lance as notas diretamente na tabela (aba **Notas**)
   - As médias M1, M2, M3 e a Média Final calculam automaticamente
6. Leia as dúvidas dos alunos (aba **Mensagens**)

### Como aluno:
1. Acesse a URL do sistema e faça login como Aluno
2. Veja suas disciplinas na tela principal
3. Clique em uma disciplina para ver suas notas detalhadas
4. Use o botão **Enviar dúvida** para mandar mensagem ao professor

---

## 🆘 Problemas comuns

**"Erro ao carregar dados"**
→ Verifique se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão corretas no GitHub Secrets

**"E-mail ou senha inválidos"**
→ Execute novamente o script SQL para garantir que os dados de exemplo foram inseridos

**Deploy falhou no GitHub Actions**
→ Verifique se os dois Secrets foram adicionados corretamente

**Página em branco no GitHub Pages**
→ Verifique se o nome do repositório é exatamente `academicoweb` (igual ao vite.config.ts)

---

## 📞 Suporte

Em caso de dúvidas, você pode perguntar ao Claude descrevendo
qual passo está com problema — guarde este guia para referência!
