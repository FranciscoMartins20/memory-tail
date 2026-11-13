# Regras

## Usar fetch nativo em vez de axios
Porquê: menos uma dependência; o Node 18+ já tem fetch.
Exemplo: `await fetch(url)` em vez de `axios.get(url)`.

## Sem novas dependências sem aprovação
Porquê: a imagem Docker já está perto do limite de tamanho.
