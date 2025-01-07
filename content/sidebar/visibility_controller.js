function update_visibility(document) {

    let reviewController = document.getElementById('reviewController');
    let postController = document.getElementById('postController');
    let settingController = document.getElementById('settingController');

    let apiLoggedIn = document.getElementById('apiLoggedIn').value;

    let currentLocation = window.location.href;


    console.log('update_visibility apiLoggedIn:', apiLoggedIn);
    console.log('update_visibility reviewController:', reviewController);

    postController.style.display = 'none';
    reviewController.style.display = 'none';
    settingController.style.display = 'none';

    console.log('update_visibility currentLocation:', currentLocation);

    if (currentLocation.includes('main')) {
        settingController.style.display = 'block';
    } else
        if (apiLoggedIn === 'true') {
            if (currentLocation.includes('review')) {
                reviewController.style.display = 'block';
            }
            if (currentLocation.includes('post')) {
                postController.style.display = 'block';
            }


        }

}