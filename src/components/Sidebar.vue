<template>
    <nav id="mainnav-container" class="mainnav">
            <div class="mainnav__inner">

                <!-- Navigation menu -->
                <div class="mainnav__top-content scrollable-content pb-5" :class="{ 'bg-dark' : parent=='company'}">



                    <!-- Company Widget -->
                    <div class="mainnav__profile mt-3 d-flex3" >

                        <div class="mt-2 d-mn-max"></div>

                        <!-- Company picture  -->
                        
                        <div class="mininav-toggle text-center py-2 collapsed">
                            <span v-on:click="$emit('update:collapse')" class="d-flex justify-content-center align-items-center">
                                <h6 class="mb-0 me-0"><i  class="text-info bi bi-building me-2"></i><template v-if="!collapse">{{this.company.vid}}</template></h6>
                            </span>
                        </div>

                        <div class="mininav-content collapse d-mn-max">
                            <div class="d-grid">
                            <!-- Company name and P.IVA -->
                                <span class="d-flex justify-content-center align-items-center">
                                    <h6 class="mb-0 me-3">{{this.company.name}}</h6>
                                </span>
                                <span class="d-flex justify-content-center align-items-center">
                                    <small >P.IVA {{this.company.vat}}</small>
                                </span>
                            </div>
                        </div>
                        <template v-if="this.companies && this.companies.length>1">
                        <div class="mt-4 d-mn-max"></div>
                        <div class="mininav-content collapse d-mn-max">
                                <div class="d-grid">
                                    <span class="d-flex justify-content-center align-items-center">
                                        <h6 class="mb-1 me-3"><i class="bi bi-arrows-angle-contract me-2"></i>Cambia azienda</h6>
                                </span>
                                    <span class="d-flex justify-content-center align-items-center">
                                        <select  name="Azienda" v-on:change="$emit('update:company',$event.target.selectedIndex)" class="form-select" title="Seleziona Azienda">
                                            <option v-for="(val,key) in this.companies" :key="key" :selected="val.id==company.id">{{val.name}}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>
                        </template>
                        </div>
                    <!-- End - Profile widget -->
                    <hr/>

                    <!-- Profile Widget -->
                    <div class="mainnav__profile d-flex3">

                        <div class="d-mn-max"></div>

                        <!-- Profile picture  -->
                        <div class="mininav-toggle text-center collapsed">
                            <img class="mainnav__avatar img-md rounded-circle border" src="../assets/img/avatar.png" height="40" width="40" alt="Profile Picture">
                        </div>
                        <div class="mininav-content collapse d-mn-max">
                            <div class="row d-md-flex justify-content-md-end align-items-center">
                                <!-- User name and position -->
                                <h6 class="col-12 d-md-flex justify-content-md-center">{{this.me.first_name}} {{this.me.last_name}}</h6>
                                <h6 class="col-12 d-md-flex justify-content-md-center">{{this.me.email}}</h6>
                            </div>
                        </div>

                    </div>
                    <!-- End - Profile widget -->
                    <hr/>
                    <!-- Navigation Category -->
                    <div class="mainnav__categoriy py-3 ">
                        <h6 class="mainnav__caption mt-0 px-3 fw-bold">Navigazione</h6>
                        <ul class="mainnav__menu nav flex-column" v-if="company || my_permission.is_staff">
                            
                            <!-- Regular menu link -->
                            <!-- Dashboard -->
                            <li class="nav-item" >
                                <a href="/dashboard/" class="nav-link mininav-toggle collapsed" :class="{ 'active' : parent=='dashboard'}"><i class="demo-pli-home fs-5 me-2"></i>

                                    <span class="nav-label mininav-content ms-1">Dashboard</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="mainnav__categoriy py-3">
                        <h6 class="mainnav__caption mt-0 px-3 fw-bold">Gestione</h6>
                        <ul class="mainnav__menu nav flex-column" v-if="company || my_permission.is_staff">
                            <!-- END : Regular menu link -->

                            <!-- Regular menu link -->
                            <!-- Orders -->
                            <li class="nav-item" >
                                <a :href="'/orders/?company='+this.company.id" class="nav-link mininav-toggle collapsed" :class="{ 'active' : parent=='orders'}"><i class="bi bi-currency-euro fs-5 me-2"></i>
                                    <span class="nav-label mininav-content ms-1">Ordini</span>
                                </a>
                            </li>
                            <!-- END : Regular menu link -->
                             <!-- Regular menu link -->
                             <li class="nav-item">
                                <a :href="'/items/?company='+this.company.id" class="nav-link mininav-toggle collapsed" :class="{ 'active' : parent=='items'}"><i class="bi-list-ol fs-5 me-2"></i>
                                    <span class="nav-label mininav-content ms-1">Inventario</span>
                                </a>
                            </li>
                            <!-- END : Regular menu link -->
                            <!-- Regular menu link -->
                            <li class="nav-item">
                                <a :href="'/offers/?company='+this.company.id" class="nav-link mininav-toggle collapsed" :class="{ 'active' : parent=='offers'}"><i class="bi-tags fs-5 me-2"></i>
                                    <span class="nav-label mininav-content ms-1">Offerte</span>
                                </a>
                            </li>
                            <!-- END : Regular menu link -->
                        </ul>
                    </div>
                    

                    <div class="mainnav__categoriy py-3">
                        <h6 class="mainnav__caption mt-0 px-3 fw-bold">Schede</h6>
                        <ul class="mainnav__menu nav flex-column" v-if="company || my_permission.is_staff">
                            <!-- Link with submenu -->
                            <!-- Products -->
                            <li class="nav-item has-sub" v-if="my_permission.is_staff || (my_permission.permission && my_permission.products>0)">

                                <a href="#" v-on:click="this.productShow=!this.productShow" class="mininav-toggle nav-link" :class="{ 'active' : parent=='products'}"><i class="bi bi-boxes fs-5 me-2"></i>
                                    <span class="nav-label ms-1">Prodotti</span>
                                </a>

                                <!-- Products submenu list -->
                                <ul class="mininav-content nav collapse" :class="{'show' : this.productShow | parent=='products'}">
                                    <li class="nav-item">
                                        <a :href="'/product/new/?company='+this.company.id" class="nav-link">Nuovo</a>
                                    </li>
                                    <li class="nav-item">
                                        <a :href="'/products/simple?company='+this.company.id" class="nav-link">Semplici</a>
                                    </li>
                                    <li class="nav-item">
                                        <a :href="'/products/multiple/?company='+this.company.id" class="nav-link">Multipli</a>
                                    </li>
                                    <li class="nav-item">
                                        <a :href="'/products/bulk/?company='+this.company.id" class="nav-link">Composti</a>
                                    </li>
                                    <li class="nav-item">
                                        <a :href="'/products/configurable/?company='+this.company.id" class="nav-link">Configurabili</a>
                                    </li>

                                </ul>
                                <!-- END : Products submenu list -->

                            </li>
                            <!-- END : Link with submenu -->


                            <!-- Categories -->
                            <!-- Regular menu link -->
                            <li class="nav-item">
                                <a :href="'/categories/?company='+this.company.id" class="nav-link mininav-toggle collapsed" :class="{ 'active' : parent=='categories'}"><i class="bi bi-ui-checks-grid fs-5 me-2"></i>
                                    <span class="nav-label mininav-content ms-1">Categorie</span>
                                </a>
                            </li>
                            <!-- END : Regular menu link -->
                            <!-- Regular menu link -->
                            <li class="nav-item">
                                <a :href="'/attributes/?company='+this.company.id" class="nav-link mininav-toggle collapsed" :class="{ 'active' : parent=='attributes'}"><i class="bi bi-ui-checks-grid fs-5 me-2"></i>
                                    <span class="nav-label mininav-content ms-1">Attributi</span>
                                </a>
                            </li>
                            <!-- END : Regular menu link -->
                        </ul>
                    </div>
                    <!-- END : Navigation Category -->

                   

                  

                    <!-- Widget -->
                    <div class="mainnav__profile">

                        <!-- Widget buttton form small navigation -->
                        <div class="mininav-toggle text-center py-2 d-mn-min collapsed">
                            <i class="demo-pli-monitor-2"></i>
                        </div>

                        <div class="d-mn-max mt-5"></div>

                        <!-- Widget content -->
                        <div class="mininav-content collapse d-mn-max">
                            <h6 class="mainnav__caption px-3 fw-bold">Azienda</h6>
                            <ul class="list-group list-group-borderless">
                                <li class="list-group-item text-reset">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <p class="mb-2 me-auto">CPU Usage</p>
                                        <span class="badge bg-info rounded">35%</span>
                                    </div>
                                    <div class="progress progress-md">
                                        <div class="progress-bar bg-info" role="progressbar" style="width: 35%" aria-label="CPU Progress" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </li>
                                <li class="list-group-item text-reset">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <p class="mb-2 me-auto">Bandwidth</p>
                                        <span class="badge bg-warning rounded">73%</span>
                                    </div>
                                    <div class="progress progress-md">
                                        <div class="progress-bar bg-warning" role="progressbar" style="width: 73%" aria-label="Bandwidth Progress" aria-valuenow="73" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </li>
                            </ul>
                            <div class="d-grid px-3 mt-3">
                                <a href="#" class="btn btn-sm btn-success">View Details</a>
                            </div>
                        </div>
                    </div>
                    <!-- End - Profile widget -->

                </div>
                <!-- End - Navigation menu -->

                

            </div>
        </nav>
     
</template>

<script>
import { useToast } from "vue-toastification";
function initialState (){
return {
        my_permission:{
        },
        ready:false,
        me:{},
        productShow:false,
    }
}

export default{
    props:['company','companies','parent','child','collapse'],

    data(){
        return initialState();
    },
    setup(){
        const toast = useToast();
        return { toast }
    },
	mounted(){
        this.getMe();
    },
    methods:{
        getMe(){
            this.axios.get("/api/me/").then((res)=>{
                this.me=res.data.results[0];
                if(res.data.results[0].is_staff==true || res.data.results[0].is_superuser==true )
                    this.my_permission.is_staff=true;
                
            })
        },

        getMyPermissions(){
            this.axios.get("api/me/authorizations/?company="+this.company.id).then((res)=>{
                this.my_permission=res.data;
            })
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