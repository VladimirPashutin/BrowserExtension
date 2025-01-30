<script setup lang="ts">
import {decode} from "js-base64";
import {onMounted,ref} from "vue"
import {NButton,NButtonGroup} from "naive-ui";
import Login from "../../components/Login.vue";
import InfoPanel from "../../components/InfoPanel.vue";
import {getOrganizationName,getPreloadedData,selectPublication,selectReview} from "./navigator.js"
import {UserInfo,StateInfo,sendMessage,onMessage,ReviewInfo,GeneratedResponse} from "../../messaging.ts";

const information = ref("");
const showInfo = ref(false);
const processing = ref(false);
const processLogin = ref(false);
const authenticated = ref(false);
const loginErrorMessage = ref("");

const isAuthenticated = () => {
  return authenticated.value
}

const login = async (form) => {
  const loggedOn = await sendMessage('processLogin', form)
  if(loggedOn) { const orgName = getOrganizationName();
    if(orgName === null || orgName.length === 0) {
      information.value = "Для работы помощника должна быть выбрана конкретная организация"
      showInfo.value = true;
      logout();
    } else {
      const userInfo: UserInfo = await sendMessage('getUserInfo', null);
      for(const organization of userInfo.communities) {
        if(organization === orgName) {
          loginErrorMessage.value = "";
          authenticated.value = true;
          processLogin.value = false;
          startProcessing();
          return;
        }
      }
      information.value = "У Вас нет полномочий для запуска помощника на выбранной организации"
      showInfo.value = true;
      logout();
    }
  } else { loginErrorMessage.value = "Ошибочный логин или пароль"; }
}

const logout = () => {
  sendMessage('logout', null)
  authenticated.value = false
  processLogin.value = false;
  processing.value = false;
}

const closeLoginForm = () => { processLogin.value = false; }

const getLoginMessage = () => { return loginErrorMessage.value; }

const startProcessing = () => {
  sendMessage('processing', true)
  processing.value = true;
}

const stopProcessing = () => {
  sendMessage('processing', false)
  processing.value = false;
}

const closeInfoPanel = () => { showInfo.value = false; }

const makeTextInput = (textareaElement: { value: string;
      dispatchEvent: (arg0: Event) => void; }, postText: string) => {
  if(textareaElement === null) { return; }
  const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
  const changeTextEvent = new Event('change', { bubbles: true });
  const inputTextEvent = new Event('input', { bubbles: true });
  textareaElement.value = postText;
  textareaElement.dispatchEvent(inputTextEvent);
  textareaElement.dispatchEvent(changeTextEvent);
  textareaElement.dispatchEvent(keyupEvent);
}

onMessage('switchLocation', async ({data}) => {
  switch(data) {
    case 'posts': await selectPublication(); break;
    case 'reviews': await selectReview(); break;
  }
});

onMessage('makePublication', async ({data}) => {
  let textInput = document.querySelector('.PostAddForm-Textarea textarea')
  let fileInput = document.getElementById('postPhoto');
  if(fileInput !== null && textInput !== null) {
    try { const changeEvent = new Event('change', { bubbles: true });
      if(data.images !== null && data.images.length > 0) {
        const dataTransfer = new DataTransfer();
        for(let i = 0; i < data.images; i++) {
          const file = new File([decode(data.images[i])], 'image' + i);
          dataTransfer.items.add(file);
        }
        //@ts-ignore
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(changeEvent);
      }
      //@ts-ignore
      makeTextInput(textInput, data.note);
      //@ts-ignore
      document.querySelector('.PostAddForm-Actions button').click();
    } catch(e) { console.error("Ошибка публикации ", e); return false; }
    return true;
  }
  return false;
})

onMessage('getUnansweredReviews', async () => {
  const data = getPreloadedData();
  if (!data || !data.initialState || !data.initialState.edit || !data.initialState.edit.reviews ||
      !data.initialState.edit.reviews.list || !Array.isArray(data.initialState.edit.reviews.list.items)) {
    console.error('Invalid data format');
    return null;
  }
  const result = [];
  for(let i = 0; i < data.initialState.edit.reviews.list.items.length; i++) {
    const review = data.initialState.edit.reviews.list.items[i];
    result[i] = new ReviewInfo(review.id, new Date(review.time_created),
                               review.author.user, review.rating, review.full_text);
  }
  return result;
});

onMessage('doResponse', (response: GeneratedResponse) => {
  for(const reviewElement of document.getElementsByClassName('Review')) {
    const reviewTextElement = reviewElement.getElementsByClassName('Review-Text')[0];
    const reviewText = reviewTextElement.textContent.toLowerCase().replaceAll(' ', '').replaceAll('\n', '');
    if(reviewText.includes(response.review.replaceAll(' ', '').replaceAll('\n', ''))) {
      const answerElement = reviewElement.getElementsByTagName('textarea')[0];
      answerElement.value = response.response;
      const event = new InputEvent('input', {
        data: answerElement.value,
        cancelable: true,
        bubbles: true
      });
      answerElement.dispatchEvent(event);
      setTimeout(() => reviewElement.getElementsByClassName('BusinessResponseDraft-SendButton')[0].click());
    }
  }
});

onMounted(async () => {
  const state: StateInfo = await sendMessage('getStateInfo', window.location.pathname)
  authenticated.value = state.authenticated
  processing.value = state.processing
});
</script>

<template>
  <div>
    <n-button-group v-if="isAuthenticated()">
      <n-button v-if="processing" quaternary type="info" @click="stopProcessing()">Остановить</n-button>
      <n-button v-else quaternary type="warning" @click="startProcessing()">Продолжить</n-button>
      <n-button quaternary type="primary" @click="logout()">Выйти</n-button>
    </n-button-group>
    <div v-else>
      <Login v-if="processLogin" :error-message="getLoginMessage()" @login="login" @close="closeLoginForm()"/>
      <n-button v-else @click="processLogin = true">Запустить помощника</n-button>
    </div>
    <InfoPanel v-if="showInfo" :info="information" @close="closeInfoPanel"/>
  </div>
</template>