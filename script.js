let input = document.querySelector('.input');
let generateButton = document.querySelector('.generate-btn');
let saveButton = document.querySelector('.save-btn');
let qrCodeImage = document.getElementById('qr-code');

const clickSound = new Audio('Button Click SFX.mp3');
clickSound.preload = 'auto';

generateButton.addEventListener("click", () => {

    playClickSound();

    if (input.value.trim() === "") { // makes sure the input is not empty or just whitespace
        alert("Please enter a valid URL or text.");
        return;
    }

    let qrCodeURL = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(input.value); // encodeURIComponent ensures that special characters in the input are properly handled
    qrCodeImage.src = qrCodeURL; // sets the src of the image to the generated QR code URL
    qrCodeImage.parentElement.classList.add('show'); // adds the 'show' class to the parent element of the QR code image, which can be used to display the QR code if it was hidden by default

});

saveButton.addEventListener("click", async () => { // the async keyword allows us to use await inside this function, which makes it easier to handle asynchronous operations like fetching the image and downloading it

    playClickSound();

    if (!qrCodeImage.parentElement.classList.contains('show')) { // checks if the QR code is currently displayed by checking if the parent element has the 'show' class. If it doesn't, it means the user hasn't generated a QR code yet, so we alert them to do so before trying to save.
        alert("Please generate a QR code first.");
        return;
    }

    try { // we use a try-catch block to handle any potential errors that might occur during the fetch and download process. If an error occurs, we catch it and alert the user that the download failed.
        const response = await fetch(qrCodeImage.src); // we fetch the image from the src of the QR code image element. This returns a response object that we can check for success and then convert to a blob for downloading.

        if (!response.ok) { // if the response is not successful (status code is not in the range 200-299), we throw an error to be caught in the catch block
            throw new Error('Download failed');
        }

        const blob = await response.blob(); // we convert the response to a blob, which is a binary representation of the image data that can be used for downloading. We use await here because response.blob() returns a promise that resolves to the blob data.
        const blobUrl = URL.createObjectURL(blob); // we create a temporary URL for the blob using URL.createObjectURL, which allows us to create a link to the blob data that can be used for downloading. This URL is only valid for the duration of the page session and should be revoked after use to free up memory.   

        const link = document.createElement('a'); // we create a new anchor element that will be used to trigger the download of the QR code image. We set its href attribute to the blob URL and its download attribute to specify the filename for the downloaded image. We then append the link to the document body, programmatically click it to start the download, and remove it from the document afterward. Finally, we revoke the blob URL to free up memory.
        link.href = blobUrl; // sets the href of the link to the blob URL we created, which points to the QR code image data
        link.download = 'qr-code.png'; // sets the download attribute of the link to specify the filename for the downloaded image. When the user clicks this link, it will trigger a download with the specified filename.
        document.body.appendChild(link); // we append the link to the document body so that it becomes part of the DOM. This is necessary because we need to programmatically click the link to trigger the download, and it needs to be in the DOM for that to work.
        link.click(); // we programmatically click the link to trigger the download of the QR code image. This simulates a user clicking on a download link, which will prompt the browser to download the file specified in the href and download attributes of the link.
        link.remove(); // after triggering the download, we remove the link from the document to clean up the DOM and prevent any unnecessary elements from lingering on the page. This is a good practice to keep the DOM clean and avoid potential issues with multiple downloads or memory leaks.

        URL.revokeObjectURL(blobUrl); // we revoke the blob URL after the download is triggered to free up memory. Blob URLs are temporary and can consume memory if not properly revoked, so it's important to call URL.revokeObjectURL with the blob URL once we're done using it.
    
    } catch (error) { // if an error occurs during the fetch or download process, we catch it and alert the user
        alert('Could not download QR code. Please try again.');
    }

});

function playClickSound(){

    clickSound.currentTime = 0;
    clickSound.play();

}