<template>
  <div id="root" class="root hd--expanded hd--sticky mn--sticky" :class="{ 'mn--max' : !collapse, 'mn--min' : collapse, }">
        <section  class="content" id="content">


        <div class="content__header content__boxed overlapping">
            <div class="content__wrap">

                    <!-- Page title and information -->
                    <h1 class="page-title mb-2">Inventario</h1>
                    <h2 class="h5">Lista dei tuoi articoli</h2>
                    <p></p>
                    <!-- END : Page title and information -->
            </div>
        </div>
        <div class="content__boxed">
            <div class="content__wrap" v-if="this.warehouse">
                <div class="row p-2 bg-light">
                    <div class="col-12 d-md-flex justify-content-md-end">
                        <a :href="'/items/new/?company='+this.company.id+'&warehouse='+this.warehouse.id" class="btn btn-success">Nuovo</a>

                    </div>
                </div>
                <div class="row p-2 bg-light">
                    <div class="col-3">
                        <b>Cambia Magazzino</b>
                        <select class="form-select ml-2" v-on:change="this.changeWarehouse($event.target.value)">
                            <option :selected="warehouse.id==this.warehouse.id" v-for="(warehouse,key) in this.warehouses" :key="key" :value="key">{{warehouse.code}} - {{ warehouse.name }}</option>
                        </select>
                    </div>
                    
                </div>
                 <div class="row p-2 bg-light">
                        
                        <div class="col-4 m-auto">
                            <b>Cerca</b>
                            <div class="input-group">
                                <input type="text" class="form-control"  placeholder="Cerca per codice o nome. (minimo tre caratteri)" v-on:keyup.enter="this.sendSearch()" v-model="this.search">
                                <div class="input-group-append"><button class="btn btn-primary" v-on:click="this.sendSearch()">Cerca</button></div>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-control mt-4 d-md-flex justify-content-md-center">
                                <span class="m-auto me-0">Mostra nascosti</span><input type="checkbox" class="m-auto ms-3 mt-0" v-model="this.showAll">
                            </div>
                        </div>
                        <div class="col-4 m-auto me-0">
                            <b>Visualizza articoli (n.)</b>
                            <select class="form-select mr-2" v-on:change="this.offset=0; this.limit=$event.target.value; this.getItems();">
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                            </select>
                        </div>
                    </div>
                    <div class="row p-2 bg-light mt-1">
                                <div class="col-9 m-auto">
                                    <div class="m-auto mb-4 d-md-flex justify-content-md-start">
                                        <b class="p-2">Articoli </b>
                                        <button class="pt-1 pb-0 btn btn-primary" v-if="this.previous" v-on:click="this.offset=this.offset-this.limit; this.getItems()">&lt;&lt;</button>
                                        <b class="m-2">{{parseFloat(this.offset)+1}} - {{parseFloat(this.offset)+parseFloat(this.limit)}}</b>
                                        <button class="pt-1 pb-0 btn btn-primary" v-if="this.next" v-on:click="this.offset=this.offset+this.limit; this.getItems()">&gt;&gt;</button>
                                    </div>
                                    <div>
                                        <span v-if="nselected>0" style="color:red;">{{nselected}} di {{count}} Selezionati</span><span v-else>{{nselected}} di {{count}} Selezionati </span><br/>
                                        <a href="#" v-on:click="selectAllItems(true)"><i><b>Seleziona visibili</b></i></a><span class="p-2"><i><b>/</b></i></span><a href="#" v-on:click="selectAllItems(false)"><i><b>Deseleziona visibili</b></i></a><span class="p-2"><i><b>/</b></i></span><a href="#" v-on:click="this.deSelectAllItems(false)"><i><b>Deseleziona tutti</b></i></a>

                                    </div>
                                </div>
                                
                                <div class="row col-3 m-auto d-md-flex justify-content-md-end">
                                   <div class="col-9 m-auto">
                                       <b>Azioni massive</b>
                                       
                                       <select class="form-select ml-2" v-model="this.actionToDo">
                                           <option value="salva">Salva</option>
                                           <option value="delete">Elimina</option>
                                       </select>

                                   </div>
                                        
                                    <div class="col-3 m-auto mb-0">
                                        <button class="btn btn-primary" v-on:click="this.doAction()">Esegui</button>
                                    </div>
                                    </div>
                                    
                                
                                <hr/>
                    </div>
                <div class="row p-2 bg-light">
                        <div class="col-12 mt-4 pt-4" v-if="loading"><span class="spinner-border  text-warning" role="status"></span></div>
                        
                        <table v-if="!loading" class="table table-striped table-center">
                            <thead>
                                <tr>
                                    <th></th><th>Codice</th><th>Nome Articolo</th><th class="hwfix">Peso (gr)</th><th class="hwfix">Larghezza (mm)</th><th class="hwfix">Altezza (mm)</th><th class="hwfix">Lunghezza/Profondità (mm)</th><th class="hwfix">Quantità in {{this.warehouse.code}}<br/>{{ this.warehouse.name }}</th><th class="hwfix">Quantità <br/>(in tutti i Magazzini)</th><th class="hwfix">Impegnati<br/>(Ordinati)</th><th class="hwfix">Disponibili<br/>(non Ordinati)</th><th></th><th></th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(item,index) in this.items" :key="index">
                                    <tr v-if="'qty' in item || this.showAll">
                                        <td><input type="checkbox" v-model="checkboxSelected[item.id]"></td>
                                        <td><b>{{item.item_code}}</b></td>
                                        <td>{{item.name}}</td>
                                        <td><input class="form-control" type="number" v-model="item.weight"></td>
                                        <td><input class="form-control" type="number" v-model="item.width"></td>
                                        <td><input class="form-control" type="number" v-model="item.height"></td>
                                        <td><input class="form-control" type="number" v-model="item.length"></td>
                                        <td>
                                            <template v-if="'qty' in item">
                                                <input class="form-control" type="number" v-model="item.qty">
                                            </template>
                                            <template v-else>
                                                <button class="btn btn-primary" v-on:click="this.createInWarehouse(index)">Crea</button>
                                            </template>
                                        </td>
                                        <td>{{item.allQty}}</td>
                                        <td>{{parseInt(item.allQty)-parseInt(item.inStockQty)}}</td>
                                        <td>{{item.inStockQty}}</td>
                                        <td><a class="btn btn-primary" :href="'/item/?id='+item.id+'&company='+this.company.id">Vedi</a></td>
                                        <td><button class="btn btn-success" v-if="'qty' in item" v-on:click="this.saveItem(index)">Salva</button></td>
                                        <td><button class="btn btn-danger" v-if="'qty' in item" v-on:click="this.deleteItem(index)">Elimina</button></td>

                                    </tr>
                                    
                                </template>
                                
                                
                                        
                                        
                                        
                                        
                                    <!-- <td v-for="(field,key) in fields" :key="key" v-show="key!='id'"><template v-if="key=='order_id'"><b>{{order[key]}}</b></template><template v-else>{{order[key]}}</template></td> -->
                            </tbody>
                        </table>
                </div>
            </div>
            <div class="content__wrap" v-else>
                <div class="row p-2 bg-light">

                    <div class="col-12 p-2">
                        <h6>Non hai ancora creato un magazzino</h6>
                        <a :href="'/warehouses/new/?company='+this.company.id" class="btn btn-success">Nuovo Magazzino</a>

                    </div>
                </div>
            </div>
            
    </div>
    <Footer/>
        </section>
            

        <HeaderNav :company.sync="company" :collapse.sync="collapse" @update:collapse="this.collapse=!this.collapse" />
        <Sidebar :collapse.sync="collapse" :company.sync="company" :companies.sync="companies" @update:company="(index) => changeCompany(index)" parent="items" @update:collapse="(collapse=false)"/>
    </div>

</template>

<script>

import Sidebar from "../../components/Sidebar.vue";
import Footer from "../../components/Footer.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import { useToast } from "vue-toastification";
function initialState (){
  return {

            
            collapse:false,
            search:"",
            items:[],
            showAll:false,
            marketplaces:[],
            marketplace:"",
            warehouse:{},
            warehouses:[],
            company:{},
            companies:[],

            
            item:{},
            
            loading:false,


            checkboxSelected:{},

            count:null,
            limit:20,
            offset:0,
            previous:null,
            next:null,

            actionToDo:null,




        }
}
export default{
    data(){
        return initialState();
    },
    setup(){
        const toast = useToast();
        return { toast }
    },
	mounted(){
        this.init();
    },
    computed:{
        nselected(){
                var i=0;
                for(var [key,obj] of Object.entries(this.checkboxSelected)){
                    if(obj){
                        i++;
                    }
                }
                return i;
            }
        
        },
        
	methods:{
        async init(){
            this.getCompanies().then(this.getWarehouses).then(this.getItems)
        },
        async getCompanies(){
            try{
                    const res = await this.axios.get("/api/companies/").then((res)=>{
                        if(res.data.results.length==0){
                            this.toast.warning("Nessuna azienda registrata");
                        }
                        else{
                            this.companies=res.data.results;
                            if(this.$route.query.company){

                                for(var i=0;i<this.companies.length;i++){
                                    if(this.companies[i].id==this.$route.query.company){
                                        this.company=this.companies[i];
                                    }
                                }
                            }
                            else{
                                this.company=this.companies[0];
                            }
                        }
                    })
                }
                catch(error) {
                    if(error.response!=null){
                        this.toast.erroritem_code=models.CharField(max_length=50)(error.response.data.detail);
                    }
                    else{
                        this.toast.error("Errore indefinito");
                    }
                };

        },
        async getWarehouses(){
            try{
                const res = await this.axios.get("/api/warehouses/?company="+this.company.id).then((res) => {
                    if(res.data.results.length>0){
                        this.warehouses=res.data.results;
                        if(this.$route.query.warehouse){
                            for(var i=0;i<this.warehouses.length;i++){
                                if(this.warehouses[i].id==this.$route.query.warehouse){
                                    this.warehouse=this.warehouses[i];
                                }
                            }
                        }
                        else{
                            this.warehouse=this.warehouses[0];
                        }
                    }
                    else{
                        this.warehouse=null
                    }
                    
            
                });
            }
            catch(error){
                this.toast.error("Nessun magazzino creato");
            }
        },
        async getItems(){
            try{
                if(this.warehouse){

                    const res = await this.axios.get("/api/warehouse/items/?company="+this.company.id+"&warehouse="+this.warehouse.id+"&limit="+this.limit+"&offset="+this.offset+"&search="+this.search).then((res) => {
                        this.items=res.data.results;
                        this.count=0;
                        for(var i=0;i<this.items.length;i++){
                            
                            this.items[i].allQty=0
                            for(var k=0;k<this.items[i].item_qty.length;k++){
                            this.items[i].allQty=parseInt(this.items[i].allQty)+parseInt(this.items[i].item_qty[k].qty)
                            if(this.items[i].item_qty[k].warehouse==this.warehouse.id){
                                this.count++;
                                this.items[i].qty=this.items[i].item_qty[k].qty
                            }
                        }
                    }
                    this.loading=false;
                    });
                }
            }
            catch(error){
                this.toast.error("Errore indefinito");
            }
        
            
        },
        createInWarehouse(index){
            let data={}
            data["item_code"]=this.items[index].item_code
            data["name"]=this.items[index].name
            data["weight"]=this.items[index].weight
            data["length"]=this.items[index].length
            data["width"]=this.items[index].width
            data["height"]=this.items[index].height
            data["warehouse"]=this.warehouse.id
            data["qty"]=this.items[index].qty
            this.axios.put("/api/warehouse/items/"+this.items[index].id+"/?company="+this.company.id,data).then((res) => {
                this.toast.success("Articolo creato nel magazzino")
                this.getItems()
            }).catch((error)=>{
                this.toast.error(error.response.detail)
            })
        },
        sendSearch(){
            if(this.search.length==0 || this.search.length>2){
                this.getItems()
            }
        }, 
        saveItem(index){
            let data={}
            data["item_code"]=this.items[index].item_code
            data["name"]=this.items[index].name
            data["weight"]=this.items[index].weight
            data["length"]=this.items[index].length
            data["width"]=this.items[index].width
            data["height"]=this.items[index].height
            data["warehouse"]=this.warehouse.id
            data["qty"]=this.items[index].qty
            this.axios.put("/api/warehouse/items/"+this.items[index].id+"/?company="+this.company.id,data).then((res) => {
                this.toast.success("Articolo salvato")
                this.getItems()
            }).catch((error)=>{
                this.toast.error(error.response.detail)
            })
        },
        
        deleteItem(index){
            this.axios.delete("/api/warehouse/items/"+this.items[index].id+"/?company="+this.company.id).then((res) => {
                this.toast.success("Articolo eliminato da tutti i magazzini")
            }).catch((error)=>{
                this.toast.error(error.response.data.detail)
            })
            
        },
        checkbox(id,event){
            this.checkboxSelected[id]=event.target.checked;
            if(event.target.checked==false){
                delete(this.checkboxSelected[id])
            }
        },

        selectAllItems(value){
            for(var i=0; i<this.items.length;i++){
                if(this.showAll){
                    this.checkboxSelected[this.items[i].id]=value;
                }
                else if("qty" in this.items[i]){
                    this.checkboxSelected[this.items[i].id]=value;
                }
                
            }
        },
        deSelectAllItems(){
            for(var key of Object.keys(this.checkboxSelected)){
                delete(this.checkboxSelected[key])
            }
        },
        
        

        
        changeCompany(key){
             
            window.location.href='/items/?company='+this.companies[key].id;
             
        },
        changeWarehouse(key){
             console.log(key)
             this.warehouse=this.warehouses[key];
             this.getItems();
              
         },
         async doAction(){
            var id_list=[]
            for(var [id,value] of Object.entries(this.checkboxSelected)){
                if(value==true){
                    id_list.push(parseInt(id))
                }
            }
            if(this.actionToDo=="save"){
                var success=[]
                var errors=[]
                
                for(var [key,item] of Object.entries(this.items)){
                    if(id_list.includes(item.id)){
                        var data={}
                        data["sku"]=product.sku
                        data["gtin"]=product.gtin
                        data["gtin_type"]=product.gtin_type
                        
                        
                        
                        await this.axios.put("/api/item/simple/?company="+this.company.id+"&marketplace="+this.actionMarket,data).then((res)=>{
                            success.push("Articolo "+item.code+ " salvato!")
                        }).catch((error)=>{
                            errors.push(error.response.data.detail)
                        })
                        
                        
                    }
                }
                if(success.length>0){
                    var messageS=""
                    for(var i=0;i<success.length;i++){
                        messageS+=success[i]+"\n"
                    }
                    this.toast.success(messageS)
                }
                if(errors.length>0){
                    var messageE=""
                    for(var i=0;i<errors.length;i++){
                        messageE+=errors[i]+"\n"
                    }
                    this.toast.error(messageE)
                }
            }
            else if(this.actionToDo=="delete"){
                for(var i=0;i<id_list.length;i++){
                    await this.axios.delete("/api/items/"+id_list[i]+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
                        this.toast.success("Articoli eliminati")
                    }).catch((error)=>{
                        this.toast.error(error);
                    })

                }
                this.checkboxSelected={}
                this.getItems()
            }
        },

    },
    components:{Sidebar,HeaderNav,Footer}


    

}
</script>
<style scoped>

.hwfix{
    width:150px;
}

td{
    padding:5px 5px 5px 5px;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(500px);
  opacity: 0;
}
.z-9{
    z-index:999999;
}
</style>