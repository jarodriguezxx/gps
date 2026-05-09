package com.marakame.api.service;

import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class PdfService {

    public byte[] generarFormatoMonitoreo(Long pacienteId, String tipo) {
        // Creamos un flujo de bytes en memoria para armar el documento
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            
            document.open(); // Abrimos el lienzo
            
            // Aquí empezaremos a maquetar el diseño oficial de Marakame
            document.add(new Paragraph("INSTITUTO MARAKAME"));
            document.add(new Paragraph("CONTROL DE " + tipo));
            document.add(new Paragraph("PACIENTE CLAVE: " + pacienteId));
            document.add(new Paragraph("Prueba: Este PDF ya es real y ya se puede abrir."));
            
            document.close(); // Cerramos el lienzo
            
            return out.toByteArray(); // Lo convertimos a bytes y lo mandamos a React
            
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
}