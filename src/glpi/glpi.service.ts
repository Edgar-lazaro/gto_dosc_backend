import axios from 'axios';

export class GlpiService {
  private baseUrl = process.env.GLPI_URL!;
  private token = process.env.GLPI_TOKEN!;

  async crearTicket(data: any) {
    return axios.post(
      `${this.baseUrl}/apirest.php/Ticket`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}