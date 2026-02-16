const download = document.querySelector(".download");
const light = document.querySelector(".light");
const qrContainer = document.querySelector("#qr-code");
const qrText = document.querySelector(".qr-text");
const shareBtn = document.querySelector(".share-btn");
const sizes = document.querySelector(".sizes");

light.addEventListener("input", handleLightColor);
qrText.addEventListener("input", handleQRText);
sizes.addEventListener("change", handleSize);
shareBtn.addEventListener("click", handleShare);

const defaultUrl = "https://portfolio-one-tan-70.vercel.app";
let colorLight = "#ffffff", // Default deve corrispondere all'input HTML
    colorDark = "#000000",
    text = defaultUrl,
    size = 400; // Impostato a 400 come nel select

function handleLightColor(e) {
    colorLight = e.target.value;
    generateQRCode();
}

function handleQRText(e) {
    const value = e.target.value;
    text = value;
    if (!value) {
        text = defaultUrl;
    }
    generateQRCode();
}

async function generateQRCode() {
    qrContainer.innerHTML = "";
    // Usiamo una dimensione fissa per la generazione per alta qualità,
    // il CSS si occuperà di ridimensionarlo visivamente (max-width: 100%)
    new QRCode("qr-code", {
        text: text,
        height: parseInt(size),
        width: parseInt(size),
        colorLight: colorLight,
        colorDark: colorDark,
        correctLevel : QRCode.CorrectLevel.H
    });
    
    // Attendiamo leggermente che il canvas sia renderizzato
    setTimeout(async () => {
        download.href = await resolveDataUrl();
    }, 50);
}

async function handleShare() {
    try {
        const base64url = await resolveDataUrl();
        const blob = await (await fetch(base64url)).blob();
        const file = new File([blob], "QRCode.png", {
            type: blob.type,
        });
        await navigator.share({
            files: [file],
            title: "QR Code",
            text: text,
        });
    } catch (error) {
        // Fallback elegante se non supportato o annullato
        console.log("Sharing not supported or cancelled");
        alert("Condivisione non supportata su questo browser o dispositivo.");
    }
}

function handleSize(e) {
    size = e.target.value;
    generateQRCode();
}

function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        // Cerchiamo l'immagine o il canvas
        const img = document.querySelector("#qr-code img");
        const canvas = document.querySelector("#qr-code canvas");

        if (img && img.src) {
            resolve(img.src);
        } else if (canvas) {
            resolve(canvas.toDataURL());
        } else {
            // Tentativo di retry breve se non ancora renderizzato
            setTimeout(() => {
                const retryCanvas = document.querySelector("#qr-code canvas");
                if(retryCanvas) resolve(retryCanvas.toDataURL());
            }, 100);
        }
    });
}

// Inizializza al caricamento
generateQRCode();