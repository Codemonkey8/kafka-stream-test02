package at.codemonkey.stream;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;

import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class JsonSerializer<T> implements Serializer<T>, Deserializer<T> {
    final ObjectMapper objectMapper = new ObjectMapper();

    final Class<T> clazz;

    public static <T> Serde<T> serdeFrom(Class<T> clazz) {
        JsonSerializer<T> jsonSerializer = new JsonSerializer<>(clazz);
        return Serdes.serdeFrom(jsonSerializer, jsonSerializer);
    }

    @Override
    public void configure(Map<String, ?> config, boolean isKey) {
        //Nothing to Configure
    }

    @Override
    public byte[] serialize(String topic, T data) {
        if (data == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsBytes(data);
        } catch (JsonProcessingException e) {
            throw new SerializationException("Error serializing JSON message", e);
        }
    }

    @Override
    public T deserialize(String topic, byte[] bytes) {
        if (bytes == null)
            return null;
//        log.info("deserialize: {}", new String(bytes));
        try {
            return objectMapper.readValue(bytes, clazz);
        } catch (Exception e) {
            throw new SerializationException(e);
        }
    }

    @Override
    public void close() {

    }
}
