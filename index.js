

//Variáveis que comunicam com a tela

const setupContainer = document.getElementById('setup-container')
const gameContainer = document.getElementById('game-container')
const wordDisplay = document.getElementById('word-display')
const gameMessage = document.getElementById('game-message')
const errorCount = document.getElementById('error-count')
const resetBtn = document.getElementById('reset-btn')

const somCerto = new Audio('sons/acerto.mp3')
const somErro = new Audio('sons/erro.mp3')

const URL_API = 'https://api-palavras-8ptt.onrender.com/'

async function iniciarJogo(event) {
    if (event.key == "Enter") {
        const nickname = document.getElementById('nickname-input').value

        if (!nickname) {
            alert('Oh meu amigo, preencha o nickname!')
            return
        }

        const response = await fetch(`${URL_API}/iniciar`,
            {

                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: nickname })
            }
        );

        const data = await response.json()

        if (data.erro) {
            alert(data.erro)
            return
        }

        setupContainer.classList.add('hidden')
        gameContainer.classList.remove('hidden')
        document.getElementById('player-display').innerText = data.mensagem

        buscarPalavras()

    }
}

async function buscarPalavras() {
    const response = await fetch(`${URL_API}/status`, {
        credentials: 'include',
        method: 'GET'
    })
    const data = await response.json()

    wordDisplay.innerHTML = ''

    //Cria os espaços dos caracteres da palavra sorteada

    for (let i = 0; i < data.qtde_caracteres; i++) {
        const span = document.createElement('span')
        span.className = 'letter-slot'
        span.id = `slot-${i}`
        wordDisplay.appendChild(span)
    }

    document.getElementById('dica-display').innerHTML = `Dica: (data.dica). `

}
async function tentarLetra(event) {

    if (event.key == "Enter") {
        const input = document.getElementById('letter-input')
        const caractere = input.value

        input.value = ''
        input.focus()
        if (!caractere) {
            alert('Digite um caractere para jogar!')
            return
        }
        const response = await fetch(`${URL_API}/tentativa`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caractere: caractere })
        })

        const data = await response.json()


        if (data.posicoes.length > 0) {
            somCerto.play(); // Toca som de acerto
        } else {
            somErro.play();  // Toca som de erro
        }
        //Atualiza as letras caso tenha acertado
        //No retorno tem data.posicoes[2,3,4,5]

        data.posicoes.forEach(pos => {
            document.getElementById(`slot-${pos}`).innerText = caractere

        });

        errorCount.innerText = data.erros_atuais
        gameMessage.innerText = data.mensagem

        if (data.status_jogo != 'Jogando') {

            resetBtn.classList.remove('hidden')

            if (data.status_jogo == 'Derrota') {
                gameMessage.style.color = 'red'

                // muda fundo para derrota
                document.body.classList.add('lose')

            } else {
                gameMessage.style.color = 'green'

                // muda fundo para vitória
                document.body.classList.add('win')
            }
        }

    }


}

function reiniciarJogo() {

    location.reload()
}