function getPlanStorageLimit(plan) {
    if (plan === 'free') {
      return '1 GB';
    } else if (plan === 'silver') {
      return '3 GB';
    } else {
      return 'Unknown';
    }
  }