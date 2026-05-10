package com.odilo.techchallenge.config;

import com.odilo.techchallenge.controller.BookController;
import com.odilo.techchallenge.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = BookController.class)
@Import(WebCorsConfig.class)
class WebCorsConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;

    @Test
    void shouldAllowConfiguredOriginForPreflight() throws Exception {
        mockMvc.perform(options("/books")
                        .header("Origin", "http://localhost:4200")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));
    }

    @Test
    void shouldAllowConfiguredOriginForGet() throws Exception {
        when(bookService.searchByTitle(isNull(), anyInt(), anyInt())).thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/books")
                        .header("Origin", "http://localhost:4200"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));
    }

    @Test
    void shouldNotExposeCorsHeadersForDisallowedOrigin() throws Exception {
        when(bookService.searchByTitle(isNull(), anyInt(), anyInt())).thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/books")
                        .header("Origin", "http://evil.example"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
