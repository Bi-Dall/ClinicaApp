import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Cliente } from 'src/app/models/Clientes';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/Response';
import { BehaviorSubject } from 'rxjs';
import { TableData } from 'src/app/models/Tables/TableData';
import { TabResult } from 'src/app/models/Tables/TabResult';
import { FileService } from '../foto-service.service';

@Injectable({
  providedIn: 'root'
})


export class ClienteService {
  public clienteVazio: Cliente = {
  id: 0, //
  nome: '', //
  foto:  '',
  saiSozinho: false, //
  dtInclusao:  '',
  clienteDesde:  '',
  ativo: false,
  areaSession:  '',
  respFinanc:  '',
  cpf:  '',
  identidade:  '',
  dtNascim:  '',
  celular:  '',
  telFixo:  '',
  telComercial:  '',
  email:  '',
  endereco: '',

  mae:  '',
  maeRestric: false,
  maeIdentidade:  '',
  maeCpf:  '',
  maeCelular:  '',
  maeTelFixo:  '',
  maeTelComercial:  '',
  maeEmail:  '',
  maeEndereco:  '',

  pai: '',
  paiRestric: false,
  paiIdentidade: '',
  paiCpf:  '',
  paiCelular:  '',
  paiTelFixo:  '',
  paiTelComercial:  '',
  paiEmail:  '',
  paiEndereco:  '',
  }
  public cliente: Cliente = this.clienteVazio;
  public success: boolean = false;
  public clientes: Cliente[] = [];
  public clientesG: Cliente[] = [];
  public caminho: string = '';
  dataSource: TableData[] = [];
  public nLin: TableData[] = [];
  public Verifica: boolean = false;
  subscription!: Subscription;
  nChanges!: boolean;
  nVezes: number = 0;
  public fotoAtual: string='';
  public data: any;
  public Vazia: TableData[] = [{
      foto: this.fotoService.semFoto,
      Ficha: '',
      selecionada: false,
      Proxses:  '',
      id: 0,
      nome:  '',
      dtNascim:  '',
      saiSozinho:  'Sim',
      ativo : true,
      areaSession:  '',
      clienteDesde:  '',
      Idade: '',
      dtInclusao :  '',
      respFinanc :  '',
      identidade :  '',
      cpf:  '',
      endereco :  '',
      email :  '',
      telFixo: '',
      celular: '',
      telComercial: '',
      mae : '',
      maeRestric : 'Não',
      maeIdentidade : '',
      maeCpf: '',
      maeEndereco : '',
      maeEmail : '',
      maeTelFixo: '',
      maeCelular: '',
      maeTelComercial: '',
      pai : '',
      paiRestric : 'Não',
      paiIdentidade : '',
      paiCpf: '',
      paiEndereco : '',
      paiEmail : '',
      paiTelFixo: '',
      paiCelular: '',
      paiTelComercial: '',
    }];

  constructor(private http: HttpClient,
    private fotoService: FileService,) { }


  private apiurl = `${environment.ApiUrl}/Cliente`
  GetClientes(): Promise<any> {
    return this.http.get<any>(`${this.apiurl}`).toPromise();
  }
  CreateCliente(cliente: Cliente) : Observable<Response<Cliente[]>>{
    return this.http.post<Response<Cliente[]>>(`${this.apiurl}` , cliente);
  }

  UpdateCliente(cliente: Cliente) : Observable<Response<Cliente[]>>{
    return this.http.put<Response<Cliente[]>>(`${this.apiurl}/Editar` , cliente);
  }

  GetClienteById(id: number) : Observable<Response<Cliente>>{
    return this.http.get<Response<Cliente>>(`${this.apiurl}/id/${id}`);
  }

  GetClientesById(id: number) : Promise<any>{
    return this.http.get<any>(`${this.apiurl}/id/${id}`).toPromise();
  }

  GetClientesByAgenda(): Promise<any> {
    return this.http.get<any>(`${this.apiurl}/Agenda`).toPromise();
  }

  private ClienteAtual = new BehaviorSubject<TableData>(this.Vazia[0]);
  ClienteAtual$ = this.ClienteAtual.asObservable();
  setClienteAtual(name: TableData) {
    this.ClienteAtual.next(name);
  }

  private ListaCliente = new BehaviorSubject<Cliente[]>([]);
  ListaCliente$ = this.ListaCliente.asObservable();
  setListaCliente(name: Cliente[]) {
    this.ListaCliente.next(name);
  }

  public ClienteA = new BehaviorSubject<number>(0);
  ClienteA$ = this.ClienteA.asObservable();
  setClienteA(name: number) {
    this.ClienteA.next(name);
  }

  private ChangesA = new BehaviorSubject<boolean>(false);
  ChangesA$ = this.ChangesA.asObservable();
  setChangesA(name: boolean) {
    this.ChangesA.next(name);
  }


  ngOnInit(){

  }

  async BuscaAgenda(){
        const data = await this.GetClientesByAgenda();
    }

  async BuscaClientesById(id: number){
    try{
      this.cliente = this.clienteVazio
      this.data = await this.GetClientesById(id);
      this.cliente = this.data.dados;
      return true;
    }
    catch{
      return false;
    }

  }

  async BuscaClientes(){

    this.clientes = [];
    this.clientesG = [];
      try {
        this.data = await this.GetClientes();
        this.success = this.data.sucesso;
        this.success = await this.Dados1();

        await this.Carregar();

        return true;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return false;
      }
    }


  async Dados1(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const verificarSucesso1 = () => {
        if (this.success === true) {
          resolve(true);
        } else {
          setTimeout(() => {
            verificarSucesso1();
          }, 100);
        }
      };

      verificarSucesso1();
    });
  }


  async Carregar(){

    const dados = this.data.dados;
        dados.map((item: { clienteDesde: string | number | Date | null; dtInclusao: string | number | Date | null; dtNascim: string | number | Date | null; }) => {
          item.clienteDesde !== null ? item.clienteDesde = new Date(item.clienteDesde!).toISOString().split('T')[0] : '---'
          item.dtInclusao !== null ? item.dtInclusao = new Date(item.dtInclusao!).toISOString().split('T')[0] : '---'
          item.dtNascim !== null ? item.dtNascim = new Date(item.dtNascim!).toISOString().split('T')[0] : '---'

          const dtNascim = item.dtNascim !== null ? item.dtNascim.split('-') : '*-*-*';
          item.dtNascim = dtNascim[2] + '/'+ dtNascim[1] + '/'+ dtNascim[0];
          const clienteDesde = item.clienteDesde !== null ? item.clienteDesde.split('-') : '*-*-*';
          item.clienteDesde = clienteDesde[2] + '/'+ clienteDesde[1] + '/'+ clienteDesde[0];
          const dtInclusao = item.dtInclusao !== null ? item.dtInclusao.split('-') : '*-*-*';
          item.dtInclusao = dtInclusao[2] + '/'+ dtInclusao[1] + '/'+ dtInclusao[0];

           });

        this.clientesG = this.data.dados;
        this.clientesG.sort((a, b) => a.nome.localeCompare(b.nome));
        this.clientes = this.data.dados;
        this.setListaCliente(this.data.dados);
    this.dataSource = [];
    for (let i of this.clientesG) {
      let aSaiS: string = 'Não';
      let aRestM: string = 'Não';
      let aRestP: string = 'Não';

      if(i.id !== undefined){

        if(i.maeRestric === true){
          aRestM = 'Sim';
        }
        if(i.paiRestric === true){
          aRestP = 'Sim';
        }
        if(i.saiSozinho === true){
          aSaiS = 'Sim';
        }
        const aId: string = i.id.toString().padStart(4, '0');
        const aIdade1 = this.converterParaDate(i.dtNascim);
        const aIdade: string = this.calcularIdade(aIdade1) + ' anos';

        this.nLin =[{foto: i.foto !== undefined ? i.foto : this.fotoService.semFoto,
          Ficha: aId,
          id: i.id,
          nome: i.nome,
          saiSozinho: aSaiS,
          dtNascim: i.dtNascim,
          areaSession: i.areaSession,
          telFixo: i.telFixo,
          celular: i.celular,
          selecionada: false,
          Idade:aIdade,
          clienteDesde:i.clienteDesde,
          dtInclusao: i.dtInclusao,
          respFinanc: i.respFinanc,
          endereco: i.endereco,
          email: i.email,
          identidade: i.identidade,
          ativo: i.ativo,
          cpf: i.cpf,
          telComercial: i.telComercial,

          mae: i.mae,
          maeIdentidade:i.maeIdentidade,
          maeCpf:i.maeCpf,
          maeRestric: aRestM,
          maeCelular: i.maeCelular,
          maeTelFixo:i.maeTelFixo,
          maeTelComercial: i.maeTelComercial,
          maeEmail: i.maeEmail,
          maeEndereco: i.maeEndereco,

          pai: i.pai,
          paiIdentidade:i.paiIdentidade,
          paiCpf:i.paiCpf,
          paiRestric: aRestP,
          paiCelular: i.paiCelular,
          paiTelFixo:i.paiTelFixo,
          paiTelComercial: i.paiTelComercial,
          paiEmail: i.paiEmail,
          paiEndereco: i.paiEndereco,
        }];
        this.dataSource = [...this.dataSource, ...this.nLin]
      }
    }
  }

  converterParaDate(dataString: string): Date {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  calcularIdade(dataNascimento: Date): string {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();

    // Ajuste para caso o aniversário ainda não tenha ocorrido este ano
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    return idade.toString();
  }
  verificarImagem(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}
