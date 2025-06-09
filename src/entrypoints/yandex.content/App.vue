<script setup lang="ts">
import {onMounted,ref} from "vue"
import {toUint8Array} from "js-base64";
import {NButton,NButtonGroup} from "naive-ui";
import Login from "../../components/Login.vue";
import InfoPanel from "../../components/InfoPanel.vue";
import {sendMessage, onMessage, StateInfo} from "~~/src/messaging.ts";
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

const base64ToBlob = (source: string) => {
  const contentType = source.substring(source.indexOf(':') + 1, source.indexOf(';'));
  const byteCharacters = atob(source.split(",")[1]);
  const byteArray = [];
  for(let i = 0; i < byteCharacters.length; i++)
  { byteArray.push(byteCharacters.charCodeAt(i)); }
  return new Blob([new Uint8Array(byteArray)], { type: contentType });
}

const login = async (form: {login: string, password: string}) => {
  const loggedOn = await sendMessage('login', form)
  if(loggedOn) { const orgName = getOrganizationName();
    if(orgName === null || orgName.length === 0) {
      information.value = "Для работы помощника должна быть выбрана конкретная организация"
      showInfo.value = true;
    } else {
      const userInfo = await sendMessage('getUserInfo', undefined);
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
      information.value = "У Вас нет полномочий для запуска помощника на выбранной организации";
      showInfo.value = true;
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
    case '/posts/': selectPublication(); break;
    case '/reviews/': selectReview(); break;
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
          const file = new File([base64ToBlob(data.images[i])], 'image' + i);
          dataTransfer.items.add(file);
        }
        //@ts-ignore
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(changeEvent);
        await sleep(5000);
      }
      //@ts-ignore
      makeTextInput(textInput, data.note);
      //@ts-ignore
      document.querySelector('.PostAddForm-Actions button').click();
      return true;
    } catch(e) { console.error("Ошибка публикации ", e); }
  }
  return false;
})

onMessage('getUnansweredReviews',() => {
  const content = getPreloadedData();
  if (!content || !content.initialState || !content.initialState.edit || !content.initialState.edit.reviews ||
      !content.initialState.edit.reviews.list || !Array.isArray(content.initialState.edit.reviews.list.items)) {
    console.error('Invalid data format');
    return undefined;
  }
  const result = [];
  for(let i = 0; i < content.initialState.edit.reviews.list.items.length; i++) {
    const review = content.initialState.edit.reviews.list.items[i];
    if('unread' === review.notify_status) {
      result.push({id: review.id, time: new Date(review.time_created),
                   author: review.author.user, rating: review.rating, text: review.full_text});
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
  const state: StateInfo = await sendMessage('getStateInfo', undefined);
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