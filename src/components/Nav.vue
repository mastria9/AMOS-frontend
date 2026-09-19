<template><nav class="navbar navbar-expand-lg " style="z-index:99999;">
                <div class="container-fluid">
                    <div class="navbar-wrapper col-6">
                        <div class="navbar-minimize">
                            <button id="minimizeSidebar" class="btn btn-warning btn-fill btn-round btn-icon d-none d-lg-block">
                                <i class="fa fa-ellipsis-v visible-on-sidebar-regular"></i>
                                <i class="fa fa-navicon visible-on-sidebar-mini"></i>
                            </button>
                        </div>
                        <div class="col-12 row">
                            <div class="col-4 p-2">
                            <span v-if="company" class="pt-2"><b>{{company.name}}</b></span>
                        </div>
                        <div class="col-6">
                        <template v-if="companies && companies.length>1">
                            <span class="ml-4 p-2">
                                <span class="mr-2" style="font-size:12px; font-weight:bold; text-transform:uppercase;">Cambia Azienda</span>
                                <select  name="Azienda" v-on:change="$emit('update:company',$event.target.selectedIndex)" class="custom-select text-center" title="Seleziona Azienda">
                                    <option v-for="(val,key) in companies" :key="key" :selected="val.id==company.id">{{val.name}}</option>
                                </select>
                            </span>
                        </template>
                    </div>
                    </div>
                    </div>
                    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-bar burger-lines"></span>
                        <span class="navbar-toggler-bar burger-lines"></span>
                        <span class="navbar-toggler-bar burger-lines"></span>
                    </button>
                    
                    <div class="collapse navbar-collapse justify-content-end">
                        
                        <ul class="navbar-nav">
                            <li class="dropdown nav-item">
                                <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                                    <i class="nc-icon nc-globe-2"></i>
                                </a>
                                <ul class="dropdown-menu">
                                    <a class="dropdown-item" v-on:click="goTo('companies')">Aziende</a>
                                    <a class="dropdown-item" v-on:click="goTo('marketplaces')">Marketplace</a>
                                    <a class="dropdown-item" v-on:click="goTo('couriers')">Corrieri</a>
                                    
                                    <a class="dropdown-item" href="#">Submit to live</a>
                                    <li class="divider"></li>
                                    <a class="dropdown-item" href="/users">Utenti</a>
                                </ul>
                            </li>
                            <li class="dropdown nav-item">
                                <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                                    <i class="nc-icon nc-bell-55"></i>
                                    <span class="notification">5</span>
                                    <span class="d-lg-none">Notification</span>
                                </a>
                                <ul class="dropdown-menu">
                                    <a class="dropdown-item" href="#">Notification 1</a>
                                    <a class="dropdown-item" href="#">Notification 2</a>
                                    <a class="dropdown-item" href="#">Notification 3</a>
                                    <a class="dropdown-item" href="#">Notification 4</a>
                                    <a class="dropdown-item" href="#">Notification 5</a>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="nc-icon nc-bullet-list-67"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                    <a class="dropdown-item" v-on:click="goTo('messages')">
                                        <i class="nc-icon nc-email-85"></i> Messages
                                    </a>
                                    <a class="dropdown-item" href="#">
                                        <i class="nc-icon nc-umbrella-13"></i> Help Center
                                    </a>
                                    <a class="dropdown-item" href="#">
                                        <i class="nc-icon nc-settings-90"></i> Settings
                                    </a>
                                    <div class="divider"></div>
                                    <a class="dropdown-item" v-on:click="goTo('imports')">
                                        <i class="nc-icon nc-cloud-upload-94"></i> Importa
                                    </a>
                                    <div class="divider"></div>
                                    <a class="dropdown-item" href="#">
                                        <i class="nc-icon nc-lock-circle-open"></i> Lock Screen
                                    </a>
                                    <a href="#" class="dropdown-item text-danger" v-on:click="logout()">
                                        <i class="nc-icon nc-button-power"></i> Log out
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
      
      
</template>
<script>

import axios from 'axios';
export default {
  data() {
    return {
        
    };
  },
  props:['company','companies'],
  
  
  mounted(){
        
      

  },
  methods: {
    logout(){
        axios.get("/api/logout/").then((res)=>{
          $cookies.remove('Authorization');
          this.$router.go("/login");
        }).catch((error)=>{
          console.log("errore");
        });
    },
    goTo(where){
        if(this.company){
            window.location.href="/"+where+"?company="+this.company.id
        }
        else{
            window.location.href="/"+where
        }
    },
    
    
  }
}
</script>
<style type="text/css">
      @font-face {
        font-family: 'Indie Flower';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url("/src/assets/fonts/m8JVjfNVeKWVnh3QMuKkFcZVaUuH.woff2") format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    .writer{
  font-family: 'Indie Flower', cursive;
  }
    </style>