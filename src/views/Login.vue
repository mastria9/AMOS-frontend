<template>
     <div class="login-page">
         
         <transition name="fade">
            <div v-if="!registerActive" class="wallpaper-login"></div>
         </transition>
         <div class="wallpaper-register"></div>
         
      
      <div class="container-fluid">
         <div class="row">
            <div class="col-md-3 m-auto">
               <div v-if="!step">
                  <div v-if="!registerActive" class="card login">
                     <div class="card-header">
                        <h4 class="card-title">Accedi</h4>
                     </div>
                     <div class="card-body">
                        <form onsubmit="event.preventDefault();" class="row g-3">
                           <div class="col-md-12">
                              <label for="username">Email</label>
                              <input id="username" v-model="username" autocomplete="username" type="username" class="form-control" placeholder="Email" autofocus required>
                           </div>
                           <div class="col-md-12">
                              <label for="password">Password</label>
                              <input id="passsword" v-model="password" autocomplete="password" type="password" class="form-control" placeholder="Password" required>
                           </div>
                           <p class="red">{{error}}</p>
                           <input type="submit" class="btn btn-primary" v-on:click="doLogin()" value="Invia">
                           
                          
                          <!-- <p>Non hai un account? <a href="#" @click="registerActive = !registerActive">Registrati!</a>
                           </p>
                           <p><a href="#">Password dimenticata?</a></p> -->
                        </form>
                        
                     </div>
                  </div>

                  <!-- <div v-else class="card register" v-bind:class="{ error: emptyFields }">
                     <h1>Richiedi la registrazione</h1>
                     <form onsubmit="event.preventDefault();" class="form-group">
                        <input v-model="emailReg" type="email" class="form-control" placeholder="Email" required>
                        <input v-model="passwordReg" type="password" class="form-control" placeholder="Password" required>
                        <input v-model="confirmReg" type="password" class="form-control" placeholder="Confirm Password" required>
                        <input type="submit" class="btn btn-primary" @click="doRegister">
                        <p>Hai già un account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Login</a>
                        </p>
                     </form>
                  </div>-->
               </div>
               <div v-else>
                  <div class="card login">
                     <div class="card-header">
                        <h4 class="card-title">Accedi</h4>
                     </div>
                     <div class="card-body">
                     
                     
                        
                        <div v-if="qrcode" class="mt-2 p-3">
                           <p>Apri la tua app di autenticazione, <b>scansiona il QR CODE</b> e inserisci il codice per la verifica</p>
                           <p><img class="mb-3" style="border:5px solid #28a745;" :src="qrcode"></p>
                        </div>

                     <form onsubmit="event.preventDefault();" class="row g-3">
                        <label for="otp">Inserisci codice</label>
                        <input style="text-align:center" v-model="otp_token" autofocus required  maxlength="6" min="6"  max="6" type="text" class="form-control" v-on:keyup="this.otp_token = this.otp_token.replace(/[^0-9]/g, ''); this.otp_token = this.otp_token.replace(/(\..*)\./g, '$1');">
                        <input v-model="username" autocomplete="username" type="username" class="form-control" placeholder="Email" required hidden>
                        <input v-model="password" autocomplete="password" type="password" class="form-control" placeholder="Password" required hidden>
                        <p class="text-danger">{{error}}</p>
                        <input type="submit" class="btn btn-primary" v-on:click="doRealLogin()" value="Invia OTP">
                     </form>
                     <hr/>
                     <div class="col-12 text-center">
                        Applicazioni OTP
                        <a title ="Google Authenticator" target="_blank" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=it&gl=US"><img class="m-1" src="/src/assets/2fa-google.png" width="30px"></a>
                        <a title ="Microsoft Authenticator" target="_blank" href="https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=it&gl=US"><img class="m-1" src="/src/assets/2fa-microsoft.png" width="30px"/></a>
                        <a title ="Duo Security" target="_blank" href="https://play.google.com/store/apps/details?id=com.duosecurity.duomobile&hl=it&gl=US"><img class="m-1" src="/src/assets/2fa-duo.png" width="30px"/></a>
                        <a title ="Yandex Authenticator" target="_blank" href="https://play.google.com/store/apps/details?id=ru.yandex.key&hl=it&gl=US"><img class="m-1" src="/src/assets/2fa-yandex.png" width="30px"/></a>
                        <a title ="Free OTP" target="_blank" href="https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp&hl=it&gl=US"><img class="m-1" src="/src/assets/2fa-freeotp.png" width="30px"/></a>
                        <a title="Authy" target="_blank" href="https://play.google.com/store/apps/details?id=com.authy.authy&hl=it&gl=US"><img class="m-1" src="/src/assets/2fa-authy.png" width="30px"/></a>
                     </div>
                  </div>
                  </div>
               </div> 
            </div>
         </div>

      </div>
   </div>


</template>

<script>
import axios from 'axios';


export default {
  name: "home",
  data() {
    return {
      username: "",
      password: "",
      step:false,
      otp_token:"",
      registerActive:false,
      error:"",
      qrcode:false,
    };
  },
  methods: {
   doLogin(){
         if(this.username=="" || this.password=="") return;
         axios.post("/api/login/", {"username": this.username,"password": this.password})
         .then((res)=>{
            if(res.data["qrcode"]!=null){
               this.qrcode="data:image/svg+xml;utf8;base64,"+res.data.qrcode
            }
            this.step=true;
            
         })
         .catch(error => {
            this.error=error.response.data.detail;
            this.username="";
            this.password="";
         });
   },

   
   doRealLogin(){
      if(!this.otp_token.match("[0-9]{6}")){
         this.error="OTP non valido";
         this.otp_token="";
         return;
      }
      axios.post("/api/login/", {"username": this.username,"password": this.password,"otp_token":this.otp_token})
         .then((res)=>{
               $cookies.set('Authorization', res.data.token);
               this.$router.go('/');
         })
         .catch(error => {
            this.error=error.response.data.detail;
            this.otp_token="";
         });
   
   },
 
  }
}
</script>
<style lang="scss" scoped>
p {
   line-height: 1rem;
}
.red{
   color:red;
}
.card {
   padding: 20px;
}

.form-group {
   input {
      margin-bottom: 20px;
   }
}

.login-page {
   align-items: center;
   display: flex;
   height: 100vh;

   .wallpaper-login {
      background: url(https://images.pexels.com/photos/32237/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)
         no-repeat center center;
      background-size: cover;
      height: 100%;
      position: absolute;
      width: 100%;
   }
   
   .fade-enter-active,
   .fade-leave-active {
  transition: opacity .5s;
}
   .fade-enter,
   .fade-leave-to {
      opacity: 0;
   }
   
   .wallpaper-register {
      background: url(https://images.pexels.com/photos/533671/pexels-photo-533671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)
         no-repeat center center;
      background-size: cover;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: -1;
   }

   h1 {
      margin-bottom: 1.5rem;
   }
}

.error {
   animation-name: errorShake;
   animation-duration: 0.3s;
}

@keyframes errorShake {
   0% {
      transform: translateX(-25px);
   }
   25% {
      transform: translateX(25px);
   }
   50% {
      transform: translateX(-25px);
   }
   75% {
      transform: translateX(25px);
   }
   100% {
      transform: translateX(0);
   }
}

</style>

