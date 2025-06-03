<script setup lang="ts">
import {decode} from "js-base64";
import {onMounted,ref} from "vue"
import {NButton,NButtonGroup} from "naive-ui";
import Login from "../../components/Login.vue";
import InfoPanel from "../../components/InfoPanel.vue";
import {UserInfo, StateInfo, sendMessage, onMessage, ReviewInfo, LoginData} from "~~/src/messaging.ts";
import {getOrganizationName,getPreloadedData,getReviewElement,selectPublication,selectReview} from "./navigator.ts"

const information = ref("");
const showInfo = ref(false);
const processing = ref(false);
const processLogin = ref(false);
const authenticated = ref(false);
const loginErrorMessage = ref("");

const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const login = async (form: LoginData) => {
  const loggedOn = await sendMessage('processLogin', form)
  if(loggedOn) { const orgName = getOrganizationName();
    if(orgName === null || orgName.length === 0) {
      information.value = "Для работы помощника должна быть выбрана конкретная организация"
      showInfo.value = true;
      await logout();
    } else {
      const userInfo: UserInfo = await sendMessage('getUserInfo', undefined);
      if(userInfo === undefined || userInfo.communities === undefined) {
        information.value = "Для работы вам должна быть доступна организация";
        showInfo.value = true;
        return;
      }
      for(const organization of userInfo.communities) {
        if(organization === orgName) {
          loginErrorMessage.value = "";
          authenticated.value = true;
          processLogin.value = false;
          await startProcessing();
          return;
        }
      }
      information.value = "У Вас нет полномочий для запуска помощника на выбранной организации"
      showInfo.value = true;
      await logout();
    }
  } else { loginErrorMessage.value = "Ошибочный логин или пароль";
    information.value = "Ошибочный логин или пароль";
    showInfo.value = true;
  }
}

const logout = async () => {
  await sendMessage('logout', undefined)
  authenticated.value = false;
  processLogin.value = false;
  await stopProcessing();
}

const getLoginMessage = () => { return loginErrorMessage.value; }

const startProcessing = async () => {
  await sendMessage('processing', true)
  processing.value = true;
}

const stopProcessing = async () => {
  await sendMessage('processing', false)
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

onMessage('getOrganization',() => {
  return <string>getOrganizationName();
});

onMessage('switchLocation',({data}) => {
  switch(data) {
    case 'posts': selectPublication(); break;
    case 'reviews': selectReview(); break;
  }
});

onMessage('makePublication',async ({data}) => {
  let textInput = document.querySelector('.PostAddForm-Textarea textarea')
  let fileInput = document.getElementById('postPhoto');
  if(fileInput !== null && textInput !== null) {
    try { const changeEvent = new Event('change', { bubbles: true });
      if(data.images !== null && data.images.length > 0) {
        const dataTransfer = new DataTransfer();
        for(let i = 0; i < data.images.length; i++) {
          const file = new File([decode(data.images[i])], 'image' + i);
          dataTransfer.items.add(file);
          //@ts-ignore
          fileInput.files = dataTransfer.files;
          fileInput.dispatchEvent(changeEvent);
          await sleep(5000);
        }
      }
      //@ts-ignore
      makeTextInput(textInput, data.note);
      //@ts-ignore
      document.querySelector('.PostAddForm-Actions button').click();
    } catch(e) { console.error("Ошибка публикации ", e); return false; }
    await sleep(2000);
    return true;
  }
  return false;
})

onMessage('getUnansweredReviews',() => {
  const content = getPreloadedData();
  if (!content || !content.initialState || !content.initialState.edit || !content.initialState.edit.reviews ||
      !content.initialState.edit.reviews.list || !Array.isArray(content.initialState.edit.reviews.list.items)) {
    console.error('Invalid data format');
    return null;
  }
  const result = [];
  for(let i = 0; i < content.initialState.edit.reviews.list.items.length; i++) {
    const review = content.initialState.edit.reviews.list.items[i];
    if('unread' === review.notify_status) {
      result.push(new ReviewInfo(review.id, new Date(review.time_created),
                  review.author.user, review.rating, review.full_text));
    }
  }
  return result;
});

onMessage('markReadReviews',({data}) => {
  const reviewElement = getReviewElement(data);
  if(reviewElement === undefined) { console.error("Ошибка позиционирования отзыва с текстом " + data); }
  else { const element = reviewElement?.getElementsByClassName('Review-Icon_type_read')?.
                         item(0) as HTMLElement;
    element.click(); }
});

onMessage('doResponse', ({data}) => {
  const reviewElement = getReviewElement(data.review);
  if(reviewElement === undefined) {
    console.error("Ошибка позиционирования отзыва " + data.id + " с текстом " + data.review);
  } else { const answerElement = reviewElement.getElementsByTagName('textarea')[0];
    answerElement.value = data.response;
    const event = new InputEvent('input', {
      data: answerElement.value,
      cancelable: true,
      bubbles: true
    });
    answerElement.dispatchEvent(event);
    sleep(1000).then(() => { const element = reviewElement.getElementsByClassName(
          'BusinessResponseDraft-SendButton')[0] as HTMLElement;
      element.click();
    });
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
    <n-button-group v-if="authenticated">
      <n-button v-if="processing" quaternary type="info" @click="stopProcessing()">Остановить</n-button>
      <n-button v-else quaternary type="warning" @click="startProcessing()">Продолжить</n-button>
      <n-button quaternary type="primary" @click="logout()">Выйти</n-button>
    </n-button-group>
    <div v-else>
      <Login v-if="processLogin" :error-message="getLoginMessage()" @login="login" @close="processLogin = false"/>
      <n-button v-else @click="processLogin = true">Запустить помощника</n-button>
    </div>
    <InfoPanel v-if="showInfo" :info="information" @close="closeInfoPanel"/>
  </div>
</template>