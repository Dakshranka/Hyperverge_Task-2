import numpy as np
from sklearn.linear_model import LogisticRegression

# Realistic sample training data (income, valid_aadhaar, valid_pan)
X = np.array([
    [25000, 1, 1],  # Low income, valid KYC
    [60000, 1, 1],  # High income, valid KYC
    [15000, 0, 1],  # Low income, invalid Aadhaar
    [40000, 1, 0],  # Medium income, invalid PAN
    [10000, 0, 0],  # Low income, invalid KYC
    [80000, 1, 1],  # High income, valid KYC
    [35000, 1, 1],  # Medium income, valid KYC
    [50000, 1, 1],  # Medium-high income, valid KYC
    [20000, 1, 0],  # Low income, invalid PAN
    [70000, 1, 1],  # High income, valid KYC
])
y = np.array([0, 1, 0, 0, 0, 1, 1, 1, 0, 1])  # 1: approved, 0: rejected

model = LogisticRegression()
model.fit(X, y)
