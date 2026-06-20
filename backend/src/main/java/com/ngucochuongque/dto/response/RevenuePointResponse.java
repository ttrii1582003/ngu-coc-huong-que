package com.ngucochuongque.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RevenuePointResponse {
    private String period;
    private long orderCount;
    private long revenue;
}
