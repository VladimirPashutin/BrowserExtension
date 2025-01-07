async function doReviewResponseGenerate(document) {
    const button = document.getElementById('reviewResponseGenerateButton');
    const originalButtonText = button.innerHTML;

    document.getElementById('reviewResponsStatus').textContent = 'Operation status: Pending';
    button.innerHTML = '<span class="spinner"></span> Generating...';
    const result = await api_service.reviewResponseGenerate(
        document.getElementById('reviewAuthor').value,
        document.getElementById('reviewRate').value,
        document.getElementById('reviewText').value
    );
    // console.log('Review response:', result);
    if (result) {
        document.getElementById('reviewResponsStatus').textContent = 'Operation status: ' + result.status;
        document.getElementById('reviewResponsId').value = result.id;
    } else {
        console.error('Error generating review response');
        document.getElementById('reviewResponsStatus').textContent = 'Operation status: ' + 'Error';
        document.getElementById('reviewResponsId').value = '';
        button.innerHTML = originalButtonText;
        return new Promise((resolve) => {
            resolve();
        });
    }

    const intervalClearedPromise = new Promise((resolve) => {
        // Refresh status each second while it is processing
        console.log('Creating interval to refresh review response status');
        const intervalId = setInterval(async () => {
            try {
                const operationId = document.getElementById('reviewResponsId').value;
                const statusResult = await api_service.getResult(operationId);
                document.getElementById('reviewResponsStatus').textContent = 'Operation status: ' + statusResult.status;
                document.getElementById('generatedAnswer').value = statusResult.response;

                console.log('Review response status:', statusResult);
                // Stop refreshing if the status is no longer processing
                if (statusResult.status !== 'processing') {
                    clearInterval(intervalId);
                    button.innerHTML = originalButtonText;
                    resolve();
                } else {
                    console.log('Review response is still processing');
                }
            } catch (error) {
                console.error('Error refreshing review response status:', error);
                document.getElementById('reviewResponsStatus').textContent = 'Operation status: Failed';
                document.getElementById('generatedAnswer').value = 'Error refreshing review response status: ' + error;
                clearInterval(intervalId);
                button.innerHTML = originalButtonText;
                resolve();
            }
        }, 1000);
    });

    console.log('awaiting on intervalClearedPromise');
    await intervalClearedPromise;
    console.log('doReviewResponseGenerate intervalClearedPromise finished');
}

function addReviewResponseGenerateButtonListener(document) {

    document.getElementById('reviewResponseGenerateButton').addEventListener('click', async function () {
        try {
            await doReviewResponseGenerate(document);
        } catch (error) {
            console.error('Error calling reviewResponseGenerate:', error);
            document.getElementById('reviewResponsStatus').textContent = 'Operation status: Failed';
        }
    });
}
