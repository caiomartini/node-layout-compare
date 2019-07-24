# Node-Layout-Compare

O projeto foi construído em Node.js utilizando a biblioteca [Blink-Diff](https://github.com/yahoo/blink-diff).

Para executar a análise é necessário informar as seguintes pastas
```
1. Pasta das imagens base para a análise.
2. Pasta das imagens a serem comparadas.
3. Pasta para o resultado final da análise.
```

Para configurar o threshold é necessário criar/editar o arquivo `threshold-config.json` na pasta das imagens base, encontramos um exemplo na pasta `samples/baseline`.

A chave `threshold` será aplicada em todas as imagens, mas caso seja necessário, podemos informar um threshold individual por imagem conforme o exemplo abaixo
```
{
    "threshold": 0,
    "images": [
        {
            "name": "cat.png",
            "threshold": 0.8
        }
    ]
}
```

O relatório do resultado da análise é encontrado na pasta de resultados com o nome `result.html`.

## Utilização em DEV
Instalando as dependencias necessárias
```
npm install
```
Executando a análise 
```
npm run dev samples/baseline samples/images-to-compare samples/results    
```

## Utilização em PRD
Gerando a imagem
```
docker build --no-cache -t node-layout-compare:latest .
```
Executando a imagem
```
docker run -it -v $(pwd)/samples/baseline/:/app/baseline-images -v $(pwd)/samples/images-to-compare/:/app/images-to-compare -v $(pwd)/results/:/app/report-result  node-layout-compare:latest
```