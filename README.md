#Adobe XD Flutter Code Generator

###Existem 2 tipos de criação de código atravez do Adobe XD

#####1° - A partir de agrupamento de pastas, tratando cada uma como um widget
#####2° - Desagrupamento de pastas, tratando cada item como único.

Ordem de verificação:

primeiro verifica se esta estritamente dentro de ALGUM NÓ
se estiver estritamente dentro de ALGUM, ele entra no nó,
se n estiver dentro de nenhum ele verificar se 
está meio dentro de ALGUM NÓ
se estiver meio dentro ele verifica se o nó é stack, 
se sim, ele só entra, se não, ele cria o stack e entra,

primeiro ele verificar se esta dentro ou meio dentro de algum nó
se dentro, ele entra no nó, se meio dentro, cria um stack


se n tiver dentro, ele só pode estar do lado ou em baixo,
pra fazer de forma que o código fique certo, tem q ter custo
benefico, pra ver onde na arvore ele se encaixa melhor

pra fazer o custo beneficio ele tem q passar por todos os nós
e criar um peso em cada nó, dps ir no menos peso, e entrar nele

column
esquerda > direita = cima > baixo
row
esquerda > direita = esquerda > direita
stack
esquerda > direita = cima > baixo

##Constructors XD:
Text
Container
Ellipse
Triangle
Line
Path
Folder
Image
Repeat Grid

##Flutter widgets usados:
Row
Column
Stack
Container
Text
Padding
InkWell
Spacer ?

##Problemas Conhecidos:

##TODO List:

* [x] Retirar itens das pastas
* [x] Verificar se widget ta em cima do outro
* [ ] Criar grafo vazio
* [ ] Verificar posicionamento dos Widgets
* [ ] Inserir widget no grafo
* [ ] Linear Gradient
* [ ] Radial Gradient
* [ ] Gerar padding a partir do grafo
* [ ] Gerar código a partir do grafo
* [ ] Re-Fatorar código
* [ ] Padrão de projeto
* [ ] RepeatGrid
* [ ] AppBar
* [ ] FrontEnd