void setup() {
  // Start Serial communication at 9600 baud
  Serial.begin(9600);
}

void loop() {
  // 1. Read the knob value (0 to 1023)
  int sensorValue = analogRead(A0);
  
  // 2. Map it to a realistic Heart Rate (60 to 180 BPM)
  // This lets you "simulate" a heart attack by turning the knob!
  int heartRate = map(sensorValue, 0, 1023, 60, 180);
  
  // 3. Generate fake SpO2 (Oxygen) data based on heart rate
  // If HR is high, drop oxygen slightly to make it realistic
  int spo2 = (heartRate > 120) ? random(85, 95) : random(96, 100);

  // 4. Create the JSON string
  // Format: {"bpm": 72, "spo2": 98, "device_id": "SENSOR_001"}
  Serial.print("{\"bpm\":");
  Serial.print(heartRate);
  Serial.print(", \"spo2\":");
  Serial.print(spo2);
  Serial.println(", \"device_id\": \"SENSOR_001\"}");

  // 5. Wait 1 second before next beat
  delay(1000);
}