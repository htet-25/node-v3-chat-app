const socket = io()

const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendlocation = document.querySelector('#send-loaction')
const $messages =document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector('#messages-template').innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const main = document.querySelector('.chat__main');
const sidebar = document.querySelector('.chat__sidebar');

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix:true })

const autoScroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeigh

    //How far have I scorlled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

function matchSidebarHeight() {
    
     // Extract the numeric value from sidebar.style.height
    const currentSidebarHeight = parseInt(sidebar.style.height, 10) || 0;
    const mainHeight = main.scrollHeight;

    console.log(`Sidebar: ${currentSidebarHeight}px, Main: ${mainHeight}px`);

    if (currentSidebarHeight < mainHeight) {
        sidebar.style.height = `${mainHeight}px`;
    }
    console.log(currentSidebarHeight+","+mainHeight)
}

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll();
    matchSidebarHeight();
})

socket.on('locationMessage', (message)=> {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
    matchSidebarHeight();
})

socket.on('roomData', ({room, users})=> {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const msg = e.target.elements.message.value

    socket.emit('sendMessage',msg, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus();

       if(error)
            return console.log(error)

       console.log("message delivered")
    })
})

$sendlocation.addEventListener('click', (e) => {
    if(!navigator.geolocation)
        return alert('Goelocation is not supported by your browser')

    $sendlocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            $sendlocation.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})

socket.emit('join',{username,room}, (error) => {
    if(error){
        alert(error)
        location.href= '/'
    }
})

// socket.on('countUpdated', (count) => {
//     console.log('count has been updated',count)
// })

// document.querySelector('#increment').addEventListener('click', ()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })