import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-agenda2',
  templateUrl: './agenda2.component.html',
  styleUrls: ['./agenda2.component.css']
})
export class Agenda2Component implements OnInit, OnDestroy{

  public colunas: number[] = [];
  public linhas: number[] = [];
  private valid1: any = null;
  constructor (private agendaService: Agenda2Service,
    private clienteService: ClienteService,
    private userService: UserService,
    public shared: SharedService,
    ) {

}

  ngOnInit(){
      this.main()
      this.buscaClientes()
      this.buscaEquipe()

      this.colunas = [];
      this.linhas = [];
      for (let i = 0; i <= 20; i++) {
        this.colunas.push(i);
      }
      for (let j = 1; j <= 15; j++) {
        this.linhas.push(j);
      }

  }
  ngOnDestroy(){

  }



  async main(){
    try {
      this.valid1 = await this.agendaService.BuscaAgenda(this.agendaService.dia)
      console.log(this.agendaService.agendaG)
      this.valid1 = await this.agendaService.BuscaAgenda(this.agendaService.dia)

    }
    catch(error)   {
      console.error('Erro ao buscar agenda:', error);
    }
  }

  async buscaClientes(){
    try {
      this.valid1 = await this.agendaService.BuscaClientes()
      console.log(this.agendaService.ListaCLientes)
    }
    catch(error)   {
      console.error('Erro ao buscar Clientes:', error);
    }
  }

  async buscaEquipe(){
    try {
      this.valid1 = await this.agendaService.BuscaColab()
      console.log(this.agendaService.ListaEquipe)
    }
    catch(error)   {
      console.error('Erro ao buscar Equipe:', error);
    }
  }


  async Dados1(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const verificarSucesso1 = () => {
        if (this.valid1 !== null) {
          resolve(true);
        } else {
          setTimeout(() => {
            this.Dados1();
          }, 300);
        }
      };
      verificarSucesso1();
    });
  }
}


