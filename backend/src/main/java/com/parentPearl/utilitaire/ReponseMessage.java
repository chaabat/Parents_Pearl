package com.parentPearl.utilitaire;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReponseMessage {
    private LocalDateTime timestamp;
    private int status;
    private String message;

    public static Map<String, Object> errors(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.OK.value());
        response.put("message", message);
        response.put("success", true);
        return response;
    }


}
