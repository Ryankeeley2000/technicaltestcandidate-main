namespace back_end.Services;

public class PasswordService : IPasswordService
{
    private readonly HashSet<string> _commonPasswords;

    public PasswordService()
    {
        _commonPasswords = LoadCommonPasswords();
    }

    public bool IsPasswordInvalid(string password)
    {
        return string.IsNullOrWhiteSpace(password) || password.Length < 7;

        //here I would do a look up to make sure the new password isn't the same as the users old password using a hash of both
    }

    public bool IsPasswordCommon(string password)
    {
        return _commonPasswords.Contains(password);
    }

    private HashSet<string> LoadCommonPasswords()
    {
        var hashSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data\\common-passwords.txt");

        if (File.Exists(filePath))
        {
            foreach (var line in File.ReadLines(filePath))
            {
                hashSet.Add(line.Trim());
            }
        }

        return hashSet;
    }
}





