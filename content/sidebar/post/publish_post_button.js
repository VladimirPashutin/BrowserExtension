async function doPublishPost(document) {

    const postId = document.getElementById('postId').value;

    // if postId is empty, then it's a new post    
    if (!postId) {
        console.error('Post ID is empty');
        return;
    }

    // mark post as published
    await api_service.markPostAsPublished(postId);

    // Fetch the image from the URL
    imageUrl = document.getElementById('postImageUrl').value;

    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a File object from the Blob
    const file = new File([blob], 'uploaded-image.png', { type: blob.type });

    // Locate the file input element
    const fileInput = document.getElementById('postPhoto');

    if (!fileInput) {
        console.error('File input element not found');
        return;
    }

    // Create a DataTransfer object to hold the file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Set the files property of the file input element
    fileInput.files = dataTransfer.files;

    // Dispatch the change event to simulate the user action
    const eventFile = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(eventFile);

    // Fill the post text
    const textareaElement = document.querySelector('.PostAddForm-Textarea textarea');
    const postText = document.getElementById('postText').value;

    simulateTextInput(textareaElement, postText);

    // Wait for the image to be uploaded
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Click the submit button
    const submitButton = document.querySelector('.PostAddForm-Actions button');
    submitButton.click();

}

function addPublishPostButtonListener(document) {
    document.getElementById('postPublishButton').addEventListener('click', async function () {
        try {
            await doPublishPost(document);
        } catch (error) {
            console.error('Error calling doPublishPost:', error);
        }
    });
}

function simulateTextInput(textareaElement, postText) {
    // Set the value of the textarea
    textareaElement.value = postText;

    // Create and dispatch the input event
    const eventText = new Event('input', { bubbles: true });
    textareaElement.dispatchEvent(eventText);

    // Create and dispatch the change event
    const changeEvent = new Event('change', { bubbles: true });
    textareaElement.dispatchEvent(changeEvent);

    // Create and dispatch the keyup event
    const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
    textareaElement.dispatchEvent(keyupEvent);

    console.log('Simulated text input');
}