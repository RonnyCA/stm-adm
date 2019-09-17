<template lang="pug">
  #anunciante-edit
    .crud-title.pb-4 Editar Anunciante
    v-card
      v-form(ref="form")
        v-container
          v-layout(row wrap)
            v-flex(md5 xs12)
              v-text-field(
                label="Nome completo/Empresa"
                v-model="anunciante.nome"
                maxlength="100"
                )
            v-flex(md4 xs12)
              v-select(
                label="Categoria"
                v-model="anunciante.categoria_id"
                @change="onSelectCategoria($event)"
                :items="categorias"
                item-text="titulo"
                item-value="id"
                )
            v-flex(md3 xs12)
              v-select(
                label="Segmento"
                v-model="anunciante.segmento_id"
                :items="segmentos"
                item-text="descricao"
                item-value="id"
                )
          v-layout(row wrap)
            v-flex(md4 xs12)
              v-text-field(
                label="Proprietário"
                v-model="anunciante.proprietario"
                maxlength="100"                
                )
            v-flex(md4 xs12)
              v-text-field(
                label="Email"
                v-model="anunciante.email"
                :rules="[rules.required]"
                )
            v-flex(md4 xs12)
              v-textarea(
                label="Descrição"
                v-model="anunciante.descricao"
                rows="0"
                auto-grow
                row-height="1"
                no-resize="true"
                counter
                maxlength="300"
                )
          v-layout(row wrap)
            v-flex(md2 xs12)
              v-text-field(
                label="CPF/CNPJ"
                v-model="anunciante.documento"
                :mask="documentoMask"
                :rules="[rules.required]"
              )
            v-flex(md2 xs12)
              v-text-field(
                label="Telefone Comercial"
                v-model="anunciante.telefone_comercial"
                :mask="maskPhone"
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Celular"
                v-model="anunciante.celular"
                :mask="maskPhone"
                :rules="[rules.required]"
                )
            v-flex(md5 xs12)
              v-text-field(
                label="Logradouro"
                v-model="endereco.logradouro"                
                maxlength="100"                
                )
            v-flex(md1 xs12)
              v-text-field(
                label="Número"
                v-model="endereco.numero"            
                )
          v-layout(row wrap)
            v-flex(md3 xs12)
              v-text-field(
                label="Bairro"
                v-model="endereco.bairro"
                maxlength="100"                
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Cidade"
                v-model="endereco.cidade"
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Estado"
                v-model="endereco.estado"
                )
            v-flex(md1 xs12)
              v-text-field(
                label="CEP"
                v-model="endereco.cep"
                mask="#####-###"                
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Complemento"
                v-model="endereco.complemento"
                maxlength="100"                
                )
          v-layout(row wrap)
            v-flex(md3 xs12)
              v-text-field(
                label="Site"
                v-model="anunciante.site"
                append-icon="launch"
                @click:append="openNewTab(anunciante.site)"
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Instagram"
                v-model="anunciante.instagram"
                append-icon="launch"
                @click:append="openNewTab(anunciante.instagram)"
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Facebook"
                v-model="anunciante.facebook"
                append-icon="launch"
                @click:append="openNewTab(anunciante.facebook)"
                )
            v-flex(md3 xs12)
              v-text-field(
                :label="labelDataNascimento"
                v-model="formatedDate"
                mask="##/##/####"
                )
    keywords-card(
      v-model="anunciante.palavras_chave"
      :readOnly="false"
    )
    foto-perfil-card(
      v-model="anunciante.arquivo"
      :id="anunciante.id"
      :edit="true"
    )
    fotos-card(
      v-model="anunciante.fotos"
      :id="anunciante.id"
      :edit="true"
    )
    horarios-atendimento-card(
      v-model="anunciante.horarios_atendimento"
      :edit="true"
    )
    horarios-especiais-card(
      v-model="anunciante"
      :edit="true"
    )
    v-layout.my-5(row)
      v-spacer
      v-btn(
        @click="goToList()"
        flat
      ) Cancelar
      v-btn(
        color="primary"
        @click="save()"
        outline
        :disabled="this.$loading.isLoading"
      ) Salvar
</template>

<script>
import Moment from 'moment';
import FotosCard from '@/components/FotosCard.vue';
import FotoPerfilCard from '@/components/FotoPerfilCard.vue';
import KeywordsCard from '@/components/KeywordsCard.vue';
import UserService from '@/services/UserService';
import CategoriaService from '@/services/CategoriaService';
import HorariosAtendimentoCard from './HorariosAtendimentoCard.vue';
import HorariosEspeciaisCard from './HorariosEspeciaisCard.vue';

export default {
  name: 'anunciante-edit',

  components: {
    HorariosAtendimentoCard,
    HorariosEspeciaisCard,
    FotosCard,
    FotoPerfilCard,
    KeywordsCard,
  },
  data: () => ({
    anunciante: {
      telefone_comercial: '',
      celular: '',
      documento: '',
      plano: {
        titulo: '',
      },
    },
    categorias: [],
    segmentos: [],
    rules: {
      required: v => !!v || 'Obrigatório',
    },
  }),

  created() {
    const { anuncianteId } = this.$route.params;

    if (anuncianteId) {
      this.loadCategorias(anuncianteId);
    }
  },

  computed: {
    labelDataNascimento() {
      const { tipo_cadastro: tipoCadastro } = this.anunciante;
      return tipoCadastro === 'PessoaJuridica' ? 'Data de fundação' : 'Data de nascimento';
    },
    endereco() {
      return this
        .anunciante
        .endereco || {};
    },
    keywordsAdvertizer() {
      const { palavras_chave: wordsAdvertizer } = this.anunciante;
      return wordsAdvertizer || [];
    },
    formatedDate: {
      get() {
        const { data_de_nascimento: dataDeNascimento } = this.anunciante;
        return Moment(dataDeNascimento).format('DD/MM/YYYY');
      },
      set(value) {
        if (value.length === 8) {
          this.anunciante.data_de_nascimento = Moment(value, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss.666');
        }
      },
    },
    documentoMask() {
      const { documento } = this.anunciante;
      if (documento.length > 11) {
        return '##.###.###/####-##';
      }
      return '###.###.###-###';
    },
    maskPhone(phone) {
      if (!phone) {
        return '';
      }
      if (phone.length <= 10) {
        return '(##) ####-#####';
      }
      return '(##) # ####-####';
    },
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao carregar.',
      type: 'error',
    },
    showSuccess: {
      title: 'Salvo',
      message: 'Registro atualizado com sucesso!',
      type: 'success',
    },
    showErrorRequiredFields: {
      title: 'Erro',
      message: 'Preencha todos os campos obrigatórios',
      type: 'error',
    },
  },

  methods: {

    loadData(id) {
      UserService
        .facade()
        .find(id)
        .then(({ data }) => {
          this.anunciante = data;
          if (!this.anunciante.arquivo) {
            this.anunciante.arquivo = { url: '' };
          }
          if (!this.anunciante.horarios_atendimento){
            this.anunciante.horarios_atendimento = {
              dia_semana_inicial: '',
              dia_semana_final: '',
              inicio: '0001-01-01T00:00',
              fim: '0001-01-01T00:00'
            }
          }

          this.$loading.finish();
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados do anunciante.',
          });
          this.$loading.finish();
        });
    },
    loadCategorias(anuncianteId) {
      this.$loading.start();
      CategoriaService
        .facade()
        .findAllWithoutPaginate()
        .then(({ data }) => {
          this.categorias = data;
          this.loadData(anuncianteId);
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados da categoria.',
          });
          this.$loading.finish();
        });
    },
    onSelectCategoria(categorySelected) {
      const selectedCategoryModel = this
        .categorias
        .find(category => category.id === categorySelected) || {};

      this.segmentos = selectedCategoryModel.segmentos;
    },
    goToList() {
      this
        .$router
        .push('/anunciantes');
    },
    openNewTab(url) {
      window.open(url, '_blank');
    },
    setArchiveToNull() {
      if (this.anunciante.arquivo.url === '') {
        this.anunciante.arquivo = null;
      }
    },
    chekHorarioDeAtendimento() {
      if (this.anunciante.dia_semana_inicial === '' || this.anunciante.dia_semana_final === '') {
        this.anunciante.horarios_atendimento = null;
      }
    },
    save() {
      if (!this.$refs.form.validate()) {
        this.showErrorRequiredFields();
        return;
      }

      this.$loading.start();
      const { anunciante } = this;
      const { id_usuario: idUsuario } = anunciante;
      this.setArchiveToNull();
      this.chekHorarioDeAtendimento();
      UserService
        .facade()
        .edit(idUsuario, anunciante)
        .then(() => {
          this.showSuccess();
          this.$loading.finish();
          this.$router.push('/anunciantes');
        })
        .catch(({ data }) => {
          this.$loading.finish();
          if (data.message) {
            this.showError({ message: data.message });
            return;
          }
          data.erros.forEach((element) => {
            this.showError({ message: element });
          });
        });
    },
  },
};
</script>
