package com.marakame.api.dto;

public class DosisDTO {
    private Integer dia;
    private String horario;
    private String dosis;

    public DosisDTO() {}

    public DosisDTO(Integer dia, String horario, String dosis) {
        this.dia = dia;
        this.horario = horario;
        this.dosis = dosis;
    }

    public Integer getDia() { return dia; }
    public void setDia(Integer dia) { this.dia = dia; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }

    public String getDosis() { return dosis; }
    public void setDosis(String dosis) { this.dosis = dosis; }
}
