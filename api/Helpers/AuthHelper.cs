using Microsoft.AspNetCore.Http;
using System;

public static class AuthHelper
{
  public static string ExtractTokenFromHeader(HttpRequest request)
  {
    if (!request.Headers.TryGetValue("Authorization", out var authHeader))
    {
      return null;
    }

    string authHeaderValue = authHeader.ToString();

    if (string.IsNullOrEmpty(authHeaderValue) || !authHeaderValue.StartsWith("Bearer "))
    {
      return null;
    }

    if (authHeaderValue.Length < 8) return null;
    return authHeaderValue.Substring(7).Trim();
  }
}
