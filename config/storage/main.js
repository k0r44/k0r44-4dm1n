function getPlanStorageLimit(plan) {
    if (plan === 'free') {
      return '1 MB';
    } else if (plan === 'silver') {
      return '200 GB';
    } else {
      return 'Unknown';
    }
  }