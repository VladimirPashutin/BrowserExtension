<script setup lang="ts">
import {onMounted,ref} from "vue"
import {NButton,NButtonGroup} from "naive-ui";
import Login from "../../components/Login.vue";
import InfoPanel from "../../components/InfoPanel.vue";
import {Publication,UserInfo} from "../../messages.ts";
import {getOrganizationName,selectPublication} from "./navigator.js"
import {sendMessage,onMessage,onOpenStreamChannel} from "webext-bridge/content-script";

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
  const loggedOn = await sendMessage('processLogin', form, 'background')
  if(loggedOn) { const orgName = getOrganizationName();
    if(orgName === null || orgName.length === 0) {
      information.value = "Для работы помощника должна быть выбрана конкретная организация"
      showInfo.value = true;
      logout();
    } else {
      const userInfo: UserInfo = await sendMessage('userInfo', null, 'background');
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
  sendMessage('logout', null, 'background')
  authenticated.value = false
  processLogin.value = false;
  processing.value = false;
}

const closeLoginForm = () => { processLogin.value = false; }

const getLoginMessage = () => { return loginErrorMessage.value; }

const startProcessing = () => {
  sendMessage('processing', true, 'background')
  console.log("Start processing")
  processing.value = true;
}

const stopProcessing = () => {
  sendMessage('processing', false, 'background')
  console.log("Stop processing");
  processing.value = false;
}

const closeInfoPanel = () => { showInfo.value = false; }

const makeTextInput = (textareaElement: { value: string;
  dispatchEvent: (arg0: Event) => void; }, postText: string) => {
  const keyupEvent = new KeyboardEvent('keyup', { bubbles: true });
  const changeTextEvent = new Event('change', { bubbles: true });
  const inputTextEvent = new Event('input', { bubbles: true });
  textareaElement.value = postText;
  textareaElement.dispatchEvent(inputTextEvent);
  textareaElement.dispatchEvent(changeTextEvent);
  textareaElement.dispatchEvent(keyupEvent);
}

onMessage('publications', async ({data}) => {
  // await selectPublication();
  const publication = new Publication(data['imagesUrl'], data['note'], data['id']);
  const fileInput = document.getElementById('postPhoto');
  const changeEvent = new Event('change', { bubbles: true });
  for(const imageUrl of publication.imagesUrl) {
    onOpenStreamChannel('image' + imageUrl, (stream) => {
      stream.onClose((data) => {
        const file = new File([data], 'image' + imageUrl);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        //@ts-ignore
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(changeEvent);
      })
    })
  }
  // makeTextInput(document.querySelector('.PostAddForm-Textarea textarea'), publication.note);
  console.log("Публикация новостей", data);
  return true;
})
// onMessage('unansweredReviews', (message) => {
//   console.log("Получение необработанных отзывов", message);
//   return [{},{}];
// })
// onMessage('doResponse', (message) => {
//   console.log("Публикация ответа на отзыв", message);
// })

interface StateInfo {
  authenticated: boolean
  processing: boolean
}

onMounted(async () => {
  const state = await sendMessage<StateInfo>('stateFlags', null, 'background')
  authenticated.value = state.authenticated
  processing.value = state.processing
})
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