let myList = [];
let lastSentenceCount = 0;
let modalVisible = false;

function sendToServer(url, data) {
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => console.log("Server response:", response))
    .catch(err => console.error("Error sending to server:", err));
}

function handleInput(e) {
    const value = e.target.value;
    // Split by sentence-ending punctuation
    const sentences = value.match(/[^.!?]+[.!?]+/g) || [];
    // Only add new sentences
    if (sentences.length > lastSentenceCount) {
        const newSentences = sentences.slice(lastSentenceCount);
        myList.push(...newSentences.map(s => s.trim()));
        lastSentenceCount = sentences.length;
        newSentences.forEach(s => console.log("Added to analysis queue:", s.trim()));
    }
}

function handleKeyDown(e) {
    if (e.key === "Enter") {
        if (myList.length > 0) {
            console.log("Sending myList to server:", myList);
            sendToServer("http://localhost:8000/list", { list: myList });
            // Optionally clear the list after sending:
            // myList = [];
            // lastSentenceCount = 0;
        }
    }
}

function attachListeners() {
    const fields = document.querySelectorAll('input[type=\"text\"], textarea');
    fields.forEach(field => {
        field.removeEventListener('input', handleInput);
        field.addEventListener('input', handleInput);
        field.removeEventListener('keydown', handleKeyDown);
        field.addEventListener('keydown', handleKeyDown);
    });
}

attachListeners();
const observer = new MutationObserver(attachListeners);
observer.observe(document.body, { childList: true, subtree: true });

function showModal() {
    if (modalVisible) return;
    modalVisible = true;
    let modal = document.createElement('div');
    modal.id = 'break-modal-box';
    modal.style.position = 'fixed';
    modal.style.bottom = '30px';
    modal.style.right = '30px';
    modal.style.background = 'rgba(30,30,30,0.95)';
    modal.style.color = 'white';
    modal.style.padding = '24px 32px';
    modal.style.borderRadius = '16px';
    modal.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
    modal.style.fontSize = '1.2em';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.7s';
    modal.style.zIndex = '999999';
    modal.innerText = 'You seem upset. Take a break and breathe.';
    document.body.appendChild(modal);
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 50);
    // Optionally, auto-hide after 20 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal.parentNode) modal.parentNode.removeChild(modal);
                modalVisible = false;
            }, 700);
        }
    }, 20000);
}

function pollResults() {
    fetch('http://localhost:8000/results')
        .then(res => res.json())
        .then(data => {
            if (data.results && typeof data.results === 'object') {
                console.log(data.results);
                // face: sad, nlp: <0.5
                if ((data.results.face === false || data.results.face === true) && data.results.nlp < 0.5) {
                    showModal();
                }
            }
        })
        .catch(err => console.error('Error polling /results:', err));
}

setInterval(pollResults, 10000);