<template>
  <div
    id="root"
    class="root hd--expanded hd--sticky mn--sticky"
    :class="{ 'mn--max': !collapse, 'mn--min': collapse }"
  >
    <section class="content" id="content">
      <div class="content__header content__boxed overlapping">
        <div class="content__wrap">
          <!-- Page title and information -->
          <h1 class="page-title mb-2">Nuovo prodotto</h1>
          <h2 class="h5">Crea un nuovo prodotto</h2>
          <p></p>
          <!-- END : Page title and information -->
        </div>
      </div>
      <div class="content__boxed">
        <div class="content__wrap">
          <!-- STEP 0-->
          <div class="row d-md-flex m-auto" v-if="step==0">
            <div class="card col-6 m-auto p-4">
                <div class="card-header">
                  <h5 class="card-title">Nuovo prodotto</h5>
                  <div class="card-category">
                    Scegli il tipo di prodotto da creare
                  </div>
                </div>
                <div class="card-body m-auto">
                  <table>
                    <tr>
                      <th>Tipo di prodotto</th>
                      <td>
                        <select class="form-select" v-model="this.product.type" v-on:change="this.step=0;">
                          <option value="simple">Semplice</option>
                          <option value="configurable">Configurabile</option>
                          <option value="multiple">Multiplo</option>
                          <option value="bulk">Composto (Bulk)</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th>Scegli il marketplace</th>
                      <td>
                        <select class="form-select form-control" v-model="this.marketplace">
                          <option v-for="(market, key) in this.marketplaces" :key="key" :value="market">{{ market._code }} - {{ market._country }} ({{market.account}})</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th>SKU</th>
                      <td><input class="form-control" type="text" v-model="product.sku"/> </td>
                    </tr>
                    <template v-if="this.product.type != 'configurable'">
                      <tr>
                        <th>Tipo GTIN</th>
                        <td>
                          <select class="form-select" v-model="this.product.gtinType" v-on:change="if(this.product.gtinType=='NOGTIN'){this.product.gtin=null;}">
                            <option value="NOGTIN">ESENTE</option>
                            <option value="EAN">EAN</option>
                            <option value="ISBN">ISBN</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th>GTIN</th>
                        <td>
                          <input class="form-control" type="text" v-model="this.product.gtin" :disabled="this.product.gtinType == 'NOGTIN'" />
                        </td>
                      </tr>
                    </template>
                  </table>
                </div>
                <div class="card-footer d-md-flex justify-content-md-center">
                  <template v-if="this.product.type == 'simple' && this.product.sku && (this.product.gtinType == 'NOGTIN' || this.product.gtin) && this.marketplace">
                    <button class="btn btn-warning" v-on:click="this.simpleCreate()">
                      Crea
                    </button>
                  </template>
                  <template v-if="this.product.type == 'configurable' && this.product.sku && this.marketplace">
                    <button class="btn btn-warning float-right" v-on:click="nextStep()" v-if="step==0"> Avanti </button>
                  </template>
                  <template v-if="this.product.type == 'multiple' && this.product.sku && (this.product.gtinType == 'NOGTIN' || this.product.gtin) && this.marketplace">
                    <button class="btn btn-warning float-right" v-on:click="nextStep()" v-if="step==0"> Avanti </button>
                  </template>
                  <template v-if="this.product.type == 'bulk' && this.product.sku && (this.product.gtinType == 'NOGTIN' || this.product.gtin) && this.marketplace">
                    <button class="btn btn-warning float-right" v-on:click="nextStep()" v-if="step==0"> Avanti </button>
                  </template>
                </div>
              </div>
            </div>
            <!-- FINE STEP 0 -->

            <!-- STEP 1-->
            <div class="row dm-d-flex m-auto mt-4" v-if="this.step==1">
              <!-- STEP 1 CONFIGURABILE -->
              <template v-if="this.product.type == 'configurable'">
                <div class="card row col-6 m-auto p-4">
                  <div class="card-header">
                    <h6 class="card-title">Scegli la modalità</h6>
                  </div>
                  <div class="card-body col-6 m-auto">
                    <ul style="list-style-type: none;">
                      <li class="p-2">
                        <input class="me-4" type="radio" :value=true v-model="iHaveChilds" :disabled="this.step!=1">
                        <span class="pb-2 m-2">I prodotti figli sono già stati inseriti</span>
                      </li>
                      <li class="p-2">
                        <input class="me-4" type="radio" :value=false v-model="iHaveChilds" :disabled="this.step!=1">
                        <span class="pb-2 m-2">Voglio creare nuovi SKU</span>
                      </li>
                    </ul>
                  </div>
                  <div class="row">
                    <div class="col-6 d-md-flex justify-content-md-start">
                      <button class="btn btn-warning" v-on:click="this.previousStep()" v-if="step==1"> Indietro</button>
                    </div>
                    <div class="col-6 d-md-flex justify-content-md-end">
                      <button class="btn btn-warning" v-on:click="this.nextStep()" v-if="step==1"> Avanti </button>
                    </div>

                  </div>
                </div>
              </template>
              <!-- FINE STEP 1 CONFIGURABILE -->

              <!-- INIZIO STEP 1 MULTIPLO -->
              <template v-else-if="this.product.type == 'multiple'">
                <div class="card col-12 m-auto p-4">
                  <div class="card-header">
                    <h6 class="card-title">Stai creando un prodotto multiplo</h6>
                    <div class="card-category">SKU <b>{{ this.product.sku }}</b> in <b>{{ this.marketplace._code }} {{ this.marketplace._country }} ({{this.marketplace.account}})</b></div>
                  </div>
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-4">
                        <template v-if="Object.keys(this.categories).length > 0">
                          <b>Seleziona la categoria in cui inserire il prodotto multiplo</b>
                          <select class="form-select form-control" v-model="this.category" v-on:change="this.getAbstractSimpleProductsInCategory()">
                            <option v-for="(categ, key) in this.pathCategories" :key="key" :value="categ.id" > {{ categ.title }} </option>
                          </select>
                        </template>
                      </div>
                      <div class="col-6">
                        <template v-if="this.abstractProductsInCategory.simple">
                          <b>Prodotti disponibili</b>
                          <select class="form-select" v-model="this.multiple.child">
                            <option v-for="(child,key) in this.abstractProductsInCategory.simple" :key="key" :value="child.id" >{{child.sku}}</option>
                          </select>
                            
                        </template>
                      </div>
                      <div class="col-2">
                        <b>Quantità nel pacco (minimo 2)</b>
                        <input class="form-control" type="number" min="2" v-model="this.multiple.qty">
                      </div>
                    </div>
                    
                  </div>
                  <div class="card-footer row">
                    <div class="col-6 d-md-flex justify-content-md-start">
                      <button class="btn btn-warning" v-on:click="this.previousStep()"> Indietro</button>
                    </div>
                    <div class="col-6 d-md-flex justify-content-md-end">
                      <button class="btn btn-warning" v-on:click="this.createMultiple()" v-if="this.multiple.child && this.category && parseInt(this.multiple.qty)>1"> Crea </button>
                    </div>
                  </div>
                </div>
              </template>
              <!-- FINE STEP 1 MULTIPLO -->


              <!-- INIZIO STEP 1 BULK -->
              <template v-else-if="this.product.type == 'bulk'">
                <div class="card col-12 m-auto p-4">
                  <div class="card-header">
                    <h6 class="card-title">Stai creando un prodotto composto (bulk)</h6>
                    <div class="card-category">SKU <b>{{ this.product.sku }}</b> in <b>{{ this.marketplace._code }} {{ this.marketplace._country }} ({{this.marketplace.account}})</b></div>
                  </div>
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-4">
                        <template v-if="Object.keys(this.categories).length > 0">
                          <b>Seleziona la categoria in cui inserire il prodotto composto (bulk)</b>
                          <select class="form-select form-control" v-model="this.category">
                            <option v-for="(categ, key) in this.pathCategories" :key="key" :value="categ.id" > {{ categ.title }} </option>
                          </select>
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer row">
                    <div class="col-6 d-md-flex justify-content-md-start">
                      <button class="btn btn-warning" v-on:click="this.previousStep()"> Indietro</button>
                    </div>
                    <div class="col-6 d-md-flex justify-content-md-end">
                      <button class="btn btn-warning" v-on:click="this.nextStep()" v-if="this.category">Avanti</button>
                    </div>
                  </div>
                </div>

              </template>
              <!-- FINE STEP 1 BULK -->
            </div>
            <!-- FINE STEP 1 -->

            <!-- STEP 2 -->
              <div class="row dm-d-flex m-auto mt-4" v-if="this.step>1">
                <!-- CONFIGURABILE -->
                <!-- PRODOTTI ESISTENTI -->
                <template v-if="this.product.type == 'configurable' && this.iHaveChilds">
                  <div class="card col-12 m-auto p-4">
                    <div class="card-header">
                      <h6 class="card-title">Stai creando un prodotto configurabile a partire da prodotti già esistenti</h6>
                      <div class="card-category">SKU <b>{{ this.product.sku }}</b> in <b>{{ this.marketplace._code }} {{ this.marketplace._country }} ({{this.marketplace.account}})</b></div>
                    </div>
                    <div class="card-body mt-2">
                      <template v-if="Object.keys(this.categories).length > 0">
                        <div class="card-category">Seleziona la categoria</div>
                        <select class="form-select form-control" v-model="this.category" v-on:change="getConfigurableCombinations(true)">
                          <option v-for="(categ, key) in this.pathCategories" :key="key" :value="categ.id" > {{ categ.title }} </option>
                        </select>
                        <template v-if="this.category">
                          <div class="row mt-4">
                            <div class="col-6">
                              <div class="mb-2"><b>Prodotti disponibili</b></div>
                              <input type="text" placeholder="Cerca per sku,titolo" v-model="this.searchProductToAdd" class="form-control">
                              <div class="form-control" style="height:300px; overflow-y:scroll;">
                                <table class="table table-sm table-hover">
                                  <tbody>
                                    <tr v-for="(child, key) in this.configurable_childs_availables_computed" :key="key" :value="child" v-on:click="this.addProduct(child)"><td><b>{{ child.sku }}</b></td></tr>
                                  </tbody>
                                </table>
                              </div>
                                
                            </div>
                            <div class="col-6">
                              <div class="mb-2"><b>Attributi varianti disponibili</b></div>
                              <input type="text" placeholder="Cerca attributo" v-model="this.searchVariationToAdd" class="form-control">
                              <div class="form-control" style="height:300px; overflow-y:scroll;">
                                <template v-if="this.configurable_variations_availables_computed.length>0">
                                  <table class="table table-sm table-hover">
                                    <tbody>
                                      <tr v-for="(variation, key) in this.configurable_variations_availables_computed" :key="key" :value="variation" v-on:click="this.addVariation(variation)"><td><b>{{ variation.description }}</b></td></tr>
                                    </tbody>
                                  </table>
                                </template>
                                <template v-else>
                                  Nessuna altra variazione disponibile
                                </template>
                              </div>
                            </div>
                            <div class="row mt-4">
                            <div class="col-6"  style="min-height:100px;">
                              <div>
                                  <b>Prodotti selezionati</b>
                                </div>
                                <div>
                                  <button class="btn btn-outline-danger m-2" v-for="(child, key) in this.configurable.childs_selected" :key="key" v-on:click="this.delProduct(child)">{{ child.sku }}</button>
                              </div>
                              </div>
                              <div class="col-6" style="min-height:100px;">
                                <div>
                                  <b>Attributi varianti selezionati</b>
                                </div>
                                <div class="d-flex flex-row">
                                  <button class="btn btn-outline-danger m-2" v-for="(variation, key) in this.configurable.variations_selected" :key="key" v-on:click="this.delVariation(variation)">{{ variation.description}}</button>
                                </div>
                              </div>
                              </div></div>
                        </template>
                        <template v-else>
                          <h6>In questa categoria non hai prodotti semplici o attributi varianti disponibili </h6>
                        </template>
                      </template>

                      <template v-else>
                        <h6>Non hai ancora creato nessuna categoria in questo Marketplace</h6>
                          <a class="btn btn-success" :href="'/categories/new/?company='+this.company.id+'&marketplace='+this.marketplace.id">Crea</a>
                      </template>
                    </div>
                    <div class="card-footer row">
                      <div class="col-6">
                        <button class="btn btn-warning" v-on:click="this.previousStep()">Indietro</button>
                      </div>
                      <div class="col-6 d-md-flex justify-content-md-end">
                        <button v-if="this.configurable.variations_selected && this.configurable.childs_selected" class="btn btn-warning" v-on:click="this.createConfigurable()">Crea</button>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- CONFIGURABILE -->
                <!-- FINE PRODOTTI ESISTENTI -->

                <!-- CONFIGURABILE -->
                <!-- PRODOTTI DA CREARE -->
                <template v-if="this.product.type == 'configurable' && !this.iHaveChilds">
                  <div class="card col-12 m-auto p-4">
                    <div class="card-header">
                      <h6 class="card-title">Stai creando un prodotto configurabile e anche i prodotti figli</h6>
                      <div class="card-category">SKU <b>{{ this.product.sku }}</b> in <b>{{ this.marketplace._code }} {{ this.marketplace._country }} ({{this.marketplace.account}})</b></div>
                    </div>
                    <div class="card-body mt-2">
                      <template v-if="Object.keys(this.categories).length > 0">
                        <div class="card-category">Seleziona la categoria</div>
                        <select class="form-select form-control" v-model="this.category">
                          <option v-for="(categ, key) in this.pathCategories" :key="key" :value="categ.id" > {{ categ.title }} </option>
                        </select>
                        <template v-if="this.category">
                          <div class="row mt-4">
                            <div class="col-2 m-auto">
                              <div class="mb-2"><b>Attributi varianti disponibili in questa categoria</b></div>
                              <div class="form-control" style="height:400px; overflow-y:scroll;">
                                <template v-if="this.pathCategories[this.category].variations">
                                  <table class="table table-sm table-hover">
                                    <tbody>
                                      <tr v-for="(variation, key) in this.pathCategories[this.category].variations" :key="key" :value="variation" v-on:click="this.addNewVariation(variation)"><td><b>{{ variation.description }}</b></td></tr>
                                    </tbody>
                                  </table>
                                </template>
                                <template v-else>
                                  Nessuna variazione disponibile
                                </template>
                              </div>
                            </div>
                            <div class="col-2 m-auto">
                              <hr/>
                              <div class="p-2  mt-4">
                                <div>
                                  <label>SKU</label>
                                  <input type="text" class="form-control" v-model="this.newConfigurable.sku_tmp" placeholder="Inserisci lo sku">
                                </div>
                                <div>
                                  <label>Tipo GTIN</label>
                                  <select class="form-select" v-model="this.newConfigurable.gtinTypeTmp" v-on:change="if(this.newConfigurable.gtinTypeTmp=='NOGTIN'){this.newConfigurable.gtin_tmp=null;}">
                                    <option value="NOGTIN">ESENTE</option>
                                    <option value="EAN">EAN</option>
                                    <option value="ISBN">ISBN</option>
                                  </select>
                                </div>
                                <div>
                                  <label>GTIN</label>
                                <input type="text" class="form-control" placeholder="Inserisci il GTIN" v-model="this.newConfigurable.gtin_tmp" :disabled="this.newConfigurable.gtinTypeTmp=='NOGTIN'">
                                </div>
                                <div class="mt-4 d-md-flex justify-content-md-end"><button class="btn btn-primary" v-on:click="addNewChild()">Aggiungi</button></div>
                              </div>
                              <hr/>
                              <div class="p-2 mt-4">
                                <h6>Variazioni scelte</h6>
                                <template v-for="(variation,key) in this.newConfigurable.variations" :key="key">
                                  <button class="m-2 btn btn-danger" v-on:click="delNewVariation(key)">{{variation.description}}</button>
                                </template>
                              </div>
                            </div>
                            <div class="col-8">
                              <div class="mt-4 col-12">
                                <table class="table">
                                  <thead><tr><th>SKU</th><th>GTIN</th><th v-for="variation,key in this.newConfigurable.variations" :key="key">{{variation.description}}</th><th>Elimina</th></tr></thead>
                                  <tbody>
                                    <template v-for="(child,key) in this.newConfigurable.childs" :key="key">
                                      <tr>
                                        <td><h6 class="form-control">{{child.sku}}</h6></td>
                                        <td><span v-if="child.gtin_type=='NOGTIN'" class="form-control">ESENTE</span><span v-else >{{child.gtin_type}} {{child_gtin}}</span></td>
                                        <td v-for="variation,key in this.newConfigurable.variations" :key="key">
                                          <template v-if="variation.type=='DECIMAL'">
                                            <div class="input-group">
                                              
                                              <input style="max-width:200px;" class="form-control" type="text" v-model="child[variation.name].value" v-on:keyup="child[variation.name].value = child[variation.name].value.replace(/[^0-9.]/g, ''); child[variation.name].value = child[variation.name].value.replace(/(\..*)\./g,'$1');">
                                              
                                              <select style="max-width:100px;" class="form-select" v-if="variation.type=='DECIMAL'" v-model="child[variation.name].unit">
                                                <option value="mm">mm</option>
                                                <option value="cm">cm</option>
                                                <option value="m">m</option>
                                                <option value="L">L</option>
                                                <option value="cL">cL</option>
                                                <option value="mL">mL</option>
                                                <option value="g">g</option>
                                                <option value="Kg">Kg</option>
                                              </select>

                                            </div>
                                          </template>
                                          <template v-else>
                                            <input class="form-control" type="text" v-model="child[variation.name].value">
                                          </template>
                                        </td>
                                        <td>
                                          <button class="btn btn-outline-danger" v-on:click="delNewChild(key)">Elimina</button>
                                        </td>
                                      </tr>
                                    </template>
                                  </tbody>
                                </table>
                            </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <h6>Scegli la categoria in cui vuoi creare i tuoi prodotti </h6>
                        </template>
                      </template>

                      <template v-else>
                        <h6>Non hai ancora creato nessuna categoria in questo Marketplace</h6>
                          <a class="btn btn-success" :href="'/categories/new/?company='+this.company.id+'&marketplace='+this.marketplace.id">Crea</a>
                      </template>
                    </div>
                    <div class="card-footer row">
                      <div class="col-6">
                        <button class="btn btn-warning" v-on:click="this.previousStep()">Indietro</button>
                      </div>
                      <div class="col-6 d-md-flex justify-content-md-end">
                        <button v-if="this.newConfigurable.variations.length>0 && this.newConfigurable.childs.length>1" class="btn btn-warning" v-on:click="this.createConfigurableWithNewChilds()">Crea</button>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- FINE NUOVI PRODOTTI CONFIGURABILE -->

              <!-- INIZIO STEP 2 PRODOTTO BULK -->
              <template v-else-if="this.product.type == 'bulk'">
                <div class="card col-12 m-auto p-4">
                  <div class="card-header">
                    <h6 class="card-title">Stai creando un prodotto composto (bulk) in {{this.pathCategories[this.category].title}}</h6>
                    <div class="card-category">SKU <b>{{ this.product.sku }}</b> in <b>{{ this.marketplace._code }} {{ this.marketplace._country }} ({{this.marketplace.account}})</b></div>
                  </div>
                  <div class="card-body mt-2">
                    <div class="row">
                      <div class="col-12 p-4 d-md-flex justify-content-md-end"><button class="btn btn-warning" v-on:click="this.addBulkChild()">Aggiungi un prodotto semplice</button></div>
                    </div>
                    <div class="row">
                      <template v-for="(child,key) in this.bulk.childs" :key="key">
                        <div class="col-4">
                          <template v-if="Object.keys(this.categories).length > 0">
                            <b>Categoria del prodotto semplice</b>
                            <select class="form-select form-control" v-model="child.category" v-on:change="this.getAbstractSimpleProductsInCategoryForBulk(key)">
                              <option v-for="(categ, key) in this.pathCategories" :key="key" :value="categ.id" > {{ categ.title }} </option>
                            </select>
                          </template>
                        </div>
                        <div class="col-4">
                          <template v-if="child.simple">
                            <b>Prodotti disponibili</b>
                            <select class="form-select" v-model="child.id">
                              <option v-for="(prod,a) in child.simple" :key="a" :value="prod.id" >{{prod.sku}}</option>
                            </select>
                              
                          </template>
                        </div>
                        <div class="col-2">
                          <template  v-if="child.id">
                            <b>Quantità nel pacco</b>
                            <input class="form-control" type="number" min="1" v-model="child.qty">
                          </template>
                        </div>
                        <div class="col-2 m-auto mb-0  d-md-flex justify-content-md-end">
                          <button class="btn btn-outline-danger" v-on:click="this.removeBulkChild(key)">Rimuovi</button>
                        </div>
                      </template>
                  </div>
                    
                  </div>
                  <div class="card-footer row">
                    <div class="col-6 d-md-flex justify-content-md-start">
                      <button class="btn btn-warning" v-on:click="this.previousStep()"> Indietro</button>
                    </div>
                    <div class="col-6 d-md-flex justify-content-md-end">
                      <button class="btn btn-warning" v-on:click="this.createBulk()" v-if="this.bulk.childs.length>1 && this.category"> Crea </button>
                    </div>
                  </div>
                </div> 
              </template>
          </div>
        </div>
      </div>
      <Footer />
    </section>

    <HeaderNav
      :company.sync="company"
      :collapse.sync="collapse"
      @update:collapse="this.collapse = !this.collapse"
    />
    <Sidebar
      :collapse.sync="collapse"
      :company.sync="company"
      :companies.sync="companies"
      @update:company="(index) => changeCompany(index)"
      parent="products"
      @update:collapse="collapse = false"
    />
  </div>
</template>

<script>
const AUTH_TOKEN = "51fb50cfbedaf479a0080615e77cc82392628a21";
import Sidebar from "../../components/Sidebar.vue";
import HeaderNav from "../../components/HeaderNav.vue";
import Footer from "../../components/Footer.vue";
import { useToast } from "vue-toastification";
function initialState() {
  return {
    collapse: false,
    step: 0,
    
    company: {},
    companies: [],
    // in questo caso marketplace viene utilizzato come market di destinazione
    marketplace: null,
    marketplaces: [],
    abstractProducts: {
      simple: {},
      configurable:{},
      multiple:{},
      bulk:{},  
    },
    
    categories: {},
    category:null,
    pathCategories: {},
    abstractProductsInCategory: {
      simple: {},
      configurable:{},
      multiple:{},
      bulk:{},
    },

    product: {
      id:null,
      sku:null,
      gtin:null,
      gtinType:null,
      type:null,
    },

    

    

    iHaveChilds: false,
    // caso in cui ho i figli
    configurable: {
      childs_selected: [],
      childs_availables: [],
      variations_selected: [],
      variations_availables: [],
    },
    variations: [],
    childs: [],
    searchProductToAdd:null,
    searchVariationToAdd:null,

    bulk:{
      childs:[]
    },


    multiple:{
      child:null,
      qty:null,
    },
    newConfigurable:{
      childs:[],
      variations:[],
      sku_tmp:null,
      gtin_tmp:null,
      gtinTypeTmp:null,
    },
  };
}
export default {
  data() {
    return initialState();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  mounted() {
    this.init();
  },
  computed: {
    configurable_childs_availables_computed(){
      var availables_computed=[]
      if(this.product.type=="configurable" && this.iHaveChilds){
        for(var i=0;i<this.configurable.childs_availables.length;i++){
          if(this.searchProductToAdd){
            if(this.configurable.childs_availables[i].sku.search(this.searchProductToAdd)!=-1){
              availables_computed.push(this.configurable.childs_availables[i])
            }
          }
          else{
            availables_computed.push(this.configurable.childs_availables[i])
          }
        }
      }
      return availables_computed
    },
    configurable_variations_availables_computed(){
      var availables_computed=[]
      if(this.product.type=="configurable" && this.iHaveChilds){
        for(var i=0;i<this.configurable.variations_availables.length;i++){
          if(this.searchVariationToAdd){
            if(this.configurable.variations_availables[i].title.search(this.searchVariationToAdd)!=-1){
              availables_computed.push(this.configurable.variations_availables[i])
            }
          }
          else{
            availables_computed.push(this.configurable.variations_availables[i])
          }
        }
      }
      return availables_computed 

    }
  },
  methods: {
    async init() {
      this.getCompanies().then(this.getMarketplaces)
    },
    async getCompanies() {
      try {
        const res = await this.axios
          .get("/api/companies/")
          .then((res) => {
            if (res.data.results.length == 0) {
              this.toast.warning("Nessuna azienda registrata");
            } else {
              this.companies = res.data.results;
              if (this.$route.query.company) {
                for (var i = 0; i < this.companies.length; i++) {
                  if (this.companies[i].id == this.$route.query.company) {
                    this.company = this.companies[i];
                  }
                }
              } else {
                this.company = this.companies[0];
              }
            }
          })
          .catch((error) => {
            if (error.response != null) {
              this.toast.error(error.response.data.detail);
            }
          });
      } catch (error) {
        this.toast.error("Errore indefinito (Azienda)");
      }
    },

    async getMarketplaces() {
      if (this.company !== null) {
        try {
          const res = await this.axios.get(
            "/api/marketplaces/?company=" + this.company.id
          );
          this.marketplaces = res.data.results;
          if (res.data.results.length < 0) {
            this.toast.error("Nessun marketplace");
          }
        } catch (error) {
          this.toast.error("Errore indefinito");
        }
      }
    },
    changeCompany(index) {
      window.location.href = "/product/new?company=" + this.companies[index].id;
    },

    async getCategories() {
      const res = await this.axios.get("/api/simplify/products/categories/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res) => {
          this.categories = {};
          this.pathCategories = {};
          for (var k = 0; k < res.data.results.length; k++) {
            this.categories[res.data.results[k].id] = res.data.results[k];
          }
          for (const [a, aValue] of Object.entries(this.categories)) {
            this.pathCategories[a] = {
              id: a,
              title: aValue.title,
              variations: aValue.variations,
            };
            for (var b = 0; b < aValue.childs.length; b++) {
              this.pathCategories[aValue.childs[b].id] = {
                id: aValue.childs[b].id,
                title: aValue.title + "\\" + aValue.childs[b].title,
                variations: aValue.childs[b].variations,
              };
            }
          }
        })
        .catch((error) => {
          this.toast.error(error);
        });
    },
    
    //Bulk
    getAbstractSimpleProductsInCategoryForBulk(key){
      this.bulk.childs[key]["simple"]={}
      this.axios.get("/api/abstract/category/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.bulk.childs[key].category+"&limit=100000").then((res)=>{
          for(var s=0;s<res.data.results.length;s++){
            this.bulk.childs[key]["simple"][res.data.results[s].id]=res.data.results[s];
          }
        }).catch((error)=>{
            this.toast.error(error);
        });
    },



    // GET della lista di tutti i prodotti semplici della company e nel marketplace
    async getAbstractSimpleProducts(){
      let res=this.axios.get("/api/abstract/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProducts["simple"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },
    // GET della lista di tutti i prodotti semplici della company del market e che stanno nella categoria
    async getAbstractSimpleProductsInCategory(){
      this.abstractProductsInCategory["simple"]={}
      let res = this.axios.get("/api/abstract/category/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProductsInCategory["simple"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },

    // GET della lista di tutti i prodotti configurabili della company e nel marketplace
    async getAbstractConfigurableProducts(){
      let res=this.axios.get("/api/abstract/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProducts["configurable"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },
    // GET della lista di tutti i prodotti configurabili della company del market e che stanno nella categoria
    async getAbstractConfigurableProductsInCategory(){
      this.abstractProductsInCategory["configurable"]={}
      let res = this.axios.get("/api/abstract/category/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProductsInCategory["configurable"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },
    // GET della lista di tutti i prodotti bulk della company e nel marketplace
    async getAbstractBulkProducts(){
      let res=this.axios.get("/api/abstract/bulk/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProducts["bulk"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },
    // GET della lista di tutti i prodotti bulk della company del market e che stanno nella categoria
    async getAbstractBulkProductsInCategory(){
      this.abstractProductsInCategory["bulk"]={}
      let res = this.axios.get("/api/abstract/category/bulk/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProductsInCategory["bulk"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },
    // GET della lista di tutti i prodotti multiple della company e nel marketplace
    async getAbstractMultipleProducts(){
      let res=this.axios.get("/api/abstract/multiple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProducts["multiple"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },
    // GET della lista di tutti i prodotti multiple della company del market e che stanno nella categoria
    async getAbstractMultipleProductsInCategory(){
      this.abstractProductsInCategory["multiple"]={}
      let res = this.axios.get("/api/abstract/category/multiple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&category="+this.category+"&limit=100000").then((res)=>{
              for(var s=0;s<res.data.results.length;s++){
                this.abstractProductsInCategory["multiple"][res.data.results[s].id]=res.data.results[s];
              }
            }).catch((error)=>{
                this.toast.error(error);
            });
    },


    // Gestisco i pulsanti next/rear
    nextStep() {
      if (this.step == 0 && (this.product.type=="multiple" || this.product.type=="bulk")) {
        this.category=null;
        this.getCategories();
      }
      else if(this.step==1 && this.product.type=="configurable"){
        this.category=null;
        this.getCategories();
      }
      this.step++;
    },

    previousStep(){
      if(this.step==1 && this.product.type=="multiple"){
        this.category=null;
      }
      else if (this.step==1 && this.product.type=="configurable"){
        this.category=null;
      }
      this.step--;
    },


    
    // salvo il prodotto semplice
    //Creazione prodotto semplice
    async simpleCreate(){
        var data={}
        data["sku"]=this.product.sku
        data["gtin_type"]=this.product.gtinType
        data["gtin"]=this.product.gtin
        data["marketplace"]=this.marketplace.id
        await this.axios.post("/api/products/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res) => {
          this.toast.success("Prodotto creato");
          this.$router.push("/product/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&id="+res.data.id)
        })
        .catch((error) => {
          this.toast.error(error.response.data.detail);
        });

    },
    //prodotto bulk
    addBulkChild(){
      var obj={}
      obj.id=null;
      obj.qty=1;
      obj.category=null;
      this.bulk.childs.push(obj)
    },
    removeBulkChild(key){
      this.bulk.childs.splice(key,1)
    },
    async createBulk(){
      let thereIsError=false
      let bulk={}
      bulk["sku"]=this.product.sku
      bulk["gtin"]=this.product.gtin
      bulk["gtin_type"]=this.product.gtinType
      bulk["childs"]=this.bulk.childs
      await this.axios.post("/api/products/bulk/?company="+this.company.id+"&marketplace="+this.marketplace.id,bulk).then((res) => {
          this.toast.success("Prodotto creato");
          bulk["id"]=res.data.id
        })
        .catch((error) => {
          thereIsError=true
          this.toast.error(error.response.data.detail);
          
        });
      if(!thereIsError){
        let cat={}
        cat["products"]=[]
        cat["products"].push(bulk["id"])
        cat["products_type"]="bulk"
        let res5 = await this.axios.put("/api/simplify/products/category/"+this.category+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,cat).then((res)=>{
            this.toast.success("Prodotto composto/bulk associato alla categoria "+this.pathCategories[this.category].title)
            this.$router.push("/product/bulk/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&id="+bulk.id)
        }).catch((error)=>{
          thereIsError=true;
          this.toast.error(error.response.data.detail)
        })
      }
      if(thereIsError){
        if(bulk["id"]){
          await this.axios.delete("/api/products/bulk/"+bulk["id"]+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
           this.toast.success("Prodotto eliminato")
          })
        }
      }
    },

    //Prodotto configurabile 
    // // Caso in cui si voglia creare il solo configurabile ed usare i figli già esistenti

    // prendo le combinazioni
    getConfigurableCombinations(reset) {
      var data = {};
      if (reset) {
        this.childs = [];
        this.variations = [];
      }
      data["childs_selected"]=this.childs 
      data["variations_selected"]=this.variations
      data["category"] = this.category;
      this.axios.put("/api/simplify/products/configurable/combinations/?company=" +this.company.id +"&marketplace=" +this.marketplace.id,data)
        .then((res) => {
          // mi deve ritornare
          this.configurable["childs_selected"] = res.data.result["childs_selected"];
          this.configurable["childs_availables"] = res.data.result["childs_availables"];
          this.configurable["variations_selected"] = res.data.result["variations_selected"];
          this.configurable["variations_availables"] = res.data.result["variations_availables"];
        })
        .catch((error) => {
          this.toast.error(error);
        });
    },
    // aggiungo un child e recupero le combinazioni nuove possibili
    addProduct(child){
      this.childs.push(child)
      this.getConfigurableCombinations()
    },
    // elimino un child e recupero le combinazioni nuove possibili
    delProduct(child){
      this.childs.splice(child,1)
      this.getConfigurableCombinations()
    },
    // aggiungo una variazione e recupero le combinazioni possibili
    addVariation(variation){
      this.variations.push(variation);
      this.getConfigurableCombinations()
    },
    // elimina una variazione e recupero le combinazioni possibili
    delVariation(variation){
      this.variations.splice(variation,1)
      this.getConfigurableCombinations()
    },
    async createConfigurable(){
      let configurable={}
      let thereIsError=false
      configurable["products"]=[]
      configurable["sku"]=this.product["sku"]
      configurable["company"]=this.company.id
      configurable["marketplace"]=this.marketplace.id
      configurable["variations"]=[]
      for(var i=0;i<this.configurable.childs_selected.length;i++){
        configurable["products"].push(this.configurable.childs_selected[i].id)
      }
      for(var i=0;i<this.configurable.variations_selected.length;i++){
        configurable["variations"].push(this.configurable.variations_selected[i].id)
      }
      await this.axios.post("/api/products/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id,configurable).then((res)=>{
        this.toast.success("Prodotto configurabile creato")
        configurable["id"]=res.data.id
        // this.$router.push("/product/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&id="+res.data.id)

      }).catch((error)=>{
        isThisError=true
        this.toast.error("Errore nel creare il prodotto configurabile")
      })
      if(!thereIsError){
        let data={}
        data["products"]=[]
        data["products"].push(this.configurable.id)
        data["products_type"]="configurable"
        
        let res5 = await this.axios.put("/api/simplify/products/category/"+this.category+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
            this.toast.success("Prodotto multiplo associato alla categoria "+this.pathCategories[this.category].title)
            this.$router.push("/product/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&id="+this.configurable.id)
        }).catch((error)=>{
          thereIsError=true;
          this.toast.error(error.response.data.detail)
        })
    }
    if(thereIsError){
      await this.axios.delete("/api/products/configurable/"+this.configurable.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
        this.toast.success("Prodotto eliminato")
      })
      }  
    },












    //Prodotto configurabile 
    // // Caso in cui si voglia creare il configurabile + i figli
    addNewChild(){
      if(this.newConfigurable.sku_tmp && ((this.newConfigurable.gtin_tmp && this.newConfigurable.gtinTypeTmp) || this.newConfigurable.gtinTypeTmp=="NOGTIN")){
        for(var i=0;i<this.newConfigurable.childs.length;i++){
          if(this.newConfigurable.sku_tmp==this.newConfigurable.childs[i]["sku"]){
            this.toast.error("Lo SKU deve essere unico!")
            return;
          }
        }
        var product={}
        product["sku"]=this.newConfigurable.sku_tmp
        product["gtin"]=this.newConfigurable.gtin_tmp
        product["gtin_type"]=this.newConfigurable.gtinTypeTmp
        for(var k=0;k<this.newConfigurable.variations.length;k++){
          product[this.newConfigurable.variations[k].name]={}
          product[this.newConfigurable.variations[k].name]["description"]=this.newConfigurable.variations[k].description
          product[this.newConfigurable.variations[k].name]["value"]=null
          if(this.newConfigurable.variations[k].type=="DECIMAL"){
            product[this.newConfigurable.variations[k].name]["unit"]=null
          }
        }
        this.newConfigurable.childs.push(product);
      }
    },
    delNewChild(key){
        this.newConfigurable.childs.splice(key,1)
    },
    addNewVariation(variation){
      if(this.newConfigurable.childs.length<1){
        this.toast.error("Prima aggiungi almeno due nuovi sku")
      }
      else{
        if(this.newConfigurable.variations.length>2){
          this.toast.error("Puoi aggiungere max 3 attributi varianti")
          return
        }
        if(this.newConfigurable.variations.length>1){
          this.toast.warning("Alcune categorie/marketplace potrebbero non accettare tre attributi varianti")
        }
        for(var i=0;i<this.newConfigurable.variations.length;i++){
          if(variation.name==this.newConfigurable.variations[i].name){  
            this.toast.error("L'attributo è già stato inserito")
            return
          }
        }
      
        this.newConfigurable.variations.push(variation)
        for(var i=0;i<this.newConfigurable.childs.length;i++){
            for(var k=0;k<this.newConfigurable.variations.length;k++){
              if(!(this.newConfigurable.variations[k].name in this.newConfigurable.childs[i])){
                this.newConfigurable.childs[i][this.newConfigurable.variations[k].name]={}
                this.newConfigurable.childs[i][this.newConfigurable.variations[k].name]["description"]=this.newConfigurable.variations[k].description
                this.newConfigurable.childs[i][this.newConfigurable.variations[k].name]["value"]=null
                if(this.newConfigurable.variations[k].type=="DECIMAL"){
                  this.newConfigurable.childs[i][this.newConfigurable.variations[k].name]["unit"]=null
                }
                
              }
  
            }
          }
        
      }
      
    },
    delNewVariation(key){
      for(var i=0;i<this.newConfigurable.childs.length;i++){
        if(this.newConfigurable.childs[i][this.newConfigurable.variations[key].name]){
          delete this.newConfigurable.childs[i][this.newConfigurable.variations[key].name]
        }
      }
      this.newConfigurable.variations.splice(key,1)

    },
    

    

   
    

    

    async createMultiple(){
      let thereIsError=false
      this.multiple["sku"]=this.product["sku"]
      let res = await this.axios.post("/api/products/multiple/?company="+this.company.id+"&marketplace="+this.marketplace.id,this.multiple).then((res)=>{
        this.toast.success("Prodotto multiplo creato")
        this.multiple["id"]=res.data.id

      }).catch((error)=>{
        thereIsError=true
        this.toast.error("Errore nel creare il prodotto multiplo")
      })
      if(!thereIsError){
        
          let data={}
          data["products"]=[]
          data["products"].push(this.multiple.id)
          data["products_type"]="multiple"
          
          let res5 = await this.axios.put("/api/simplify/products/category/"+this.category+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,data).then((res)=>{
              this.toast.success("Prodotto multiplo associato alla categoria "+this.pathCategories[this.category].title)
              this.$router.push("/product/multiple/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&id="+this.multiple.id)
          }).catch((error)=>{
            thereIsError=true;
            this.toast.error(error.response.data.detail)
          })
      }
      if(thereIsError){
          await this.axios.delete("/api/products/multiple/"+this.multiple.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
            this.toast.success("Prodotto eliminato")
          })
      }  
    },  

    async createConfigurableWithNewChilds(){
      
      let configurable={}
      configurable["sku"]=this.product.sku
      configurable["marketplace"]=this.marketplace.id
      configurable["variations"]=[]
      for(var v=0; v<this.newConfigurable.variations.length;v++){
        configurable["variations"].push(this.newConfigurable.variations[v]["name"])
      }
      configurable["childs"]=[]
      let childs_created={}
      childs_created=[]
      let thereIsError=false
      for(var i=0;i<this.newConfigurable.childs.length;i++){
        let child={}
        child["sku"]=this.newConfigurable.childs[i]["sku"];
        child["gtin_type"]=this.newConfigurable.childs[i]["gtin_type"];
        child["gtin"]=this.newConfigurable.childs[i]["gtin"];
        if(!thereIsError){
          let data=configurable["childs"][i]
          let res = await this.axios.post("/api/products/simple/?company="+this.company.id+"&marketplace="+this.marketplace.id,child).then((res) => {
              childs_created.push(res.data.id)
              this.newConfigurable.childs[i]["id"]=res.data.id
            })
            .catch((error) => {
              thereIsError=true;
              this.toast.error(error.response.data.detail);
            });
        }
      }
      //prodotti semplici creati

      if(!thereIsError){
        //se non c'è stato errore li associo alla categoria
        this.toast.success("Prodotti semplici creati")
        if(!(thereIsError)){
          let ids={}
          ids["products"]=childs_created
          ids["products_type"]="simple"
          let res3 = await this.axios.put("/api/simplify/products/category/"+this.category+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,ids).then((res)=>{
              this.toast.success("Prodotti associati alla categoria "+this.pathCategories[this.category].title)
          }).catch((error)=>{
            thereIsError=true;
            this.toast.error(error.response.data.detail)
          })
        }      
      }
      //associati


      if(!thereIsError){
        //se non c'è stato errore creo gli attributi dei semplici
        for(var i=0;i<this.newConfigurable.childs.length;i++){
          let child={}
          child["sku"]=this.newConfigurable.childs[i]["sku"]
          child["marketplace"]={}
          child["marketplace"][this.marketplace.id]={}
          for(var v=0; v<this.newConfigurable.variations.length;v++){
            if(this.newConfigurable.variations[v].type=="DECIMAL"){
              child["marketplace"][this.marketplace.id][this.newConfigurable.variations[v].name]={}
              child["marketplace"][this.marketplace.id][this.newConfigurable.variations[v].name]["value"]=this.newConfigurable.childs[i][this.newConfigurable.variations[v].name].value
              child["marketplace"][this.marketplace.id][this.newConfigurable.variations[v].name]["unit"]=this.newConfigurable.childs[i][this.newConfigurable.variations[v].name].unit
            }
            else{
              child["marketplace"][this.marketplace.id][this.newConfigurable.variations[v].name]=this.newConfigurable.childs[i][this.newConfigurable.variations[v].name].value
            }
            let res = await this.axios.put("/api/products/simple/"+this.newConfigurable.childs[i]["id"]+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,child).then((res) => {
              this.newConfigurable.childs[i]["id"]=res.data.id
            })
            .catch((error) => {
              thereIsError=true;
              this.toast.error(error.response.data.detail);
            });
          }
        
        }
      }
      
      if(!thereIsError){
        // se non c'è stato errore creo il configurabile
        this.toast.success("Attributi dei prodotti semplici creati")
        let configurable={}
        configurable["sku"]=this.product["sku"]
        configurable["company"]=this.company.id
        configurable["marketplace"]=this.marketplace.id
        configurable["products"]=[]
        configurable["variations"]=[]
        for(var i=0;i<this.newConfigurable.childs.length;i++){
          configurable["products"].push(this.newConfigurable.childs[i].id)
        }
        for(var i=0;i<this.newConfigurable.variations.length;i++){
          configurable["variations"].push(this.newConfigurable.variations[i].id)
        }
        await this.axios.post("/api/products/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id,configurable).then((res)=>{
          this.product["id"]=res.data.id
          this.toast.success("Prodotto configurabile creato")
        }).catch((error)=>{
          this.toast.error("Errore nel creare il configurabile")
          thereIsError=true;

        })
      }
      if(!thereIsError){
        //se non c'è stato errore associo il configurabile alla categoria
        let ids={}
        ids["products"]=[]
        ids["products"].push(this.product.id)
        ids["products_type"]="configurable"
        
        await this.axios.put("/api/simplify/products/category/"+this.category+"/?company="+this.company.id+"&marketplace="+this.marketplace.id,ids).then((res)=>{
            this.toast.success("Configurabile associato alla categoria "+this.pathCategories[this.category].title)
            this.$router.push("/product/configurable/?company="+this.company.id+"&marketplace="+this.marketplace.id+"&id="+this.product.id)
        }).catch((error)=>{
          thereIsError=true;
          this.toast.error(error.response.data.detail)
        })
          
      }
      if(thereIsError){
          for(var d=0;d<childs_created.length;d++){
            await this.axios.delete("/api/products/simple/"+childs_created["simple"][d]+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
              this.toast.error("Prodotti eliminati")
            })
          }
          if(this.product["id"]){
            await this.axios.delete("/api/products/configurable/"+this.product.id+"/?company="+this.company.id+"&marketplace="+this.marketplace.id).then((res)=>{
                this.toast.error("Configurabile eliminato")
              })
          }
        }
      }

      
      
        
      
      
    



  },
  components: { Sidebar, HeaderNav, Footer },
};
</script>

