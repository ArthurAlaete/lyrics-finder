const api = `https://api.lyrics.ovh`

const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const insertSongsIntoPage = songsInfo => {
    const lis = songsInfo.data.map(song => 
    `<li>
        <h3>${song.title}</h3>
        <h4>${song.artist.name}</h4>
    </li>
    `)
    .reduce((accumulator, li)  => accumulator += li , '')

    songsContainer.innerHTML = lis
}   

const fetchSongs = async term => {
    const response = await fetch(`${api}/suggest/${term}`)
    const data = await response.json()

    insertSongsIntoPage(data)

}


form.addEventListener('submit', event => {
    event.preventDefault()

    const searchValue = searchInput.value.trim()

    if (!searchValue) {
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido.</li>`
        return
    } 
    
    fetchSongs(searchValue) 
    console.log(searchValue)
})
